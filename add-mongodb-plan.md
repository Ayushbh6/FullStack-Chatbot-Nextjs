 # Add MongoDB Integration Plan

 This document provides a step-by-step guide to integrate MongoDB into the Next.js App Router chatbot application. It covers user persistence via NextAuth, storing conversations per user, and surfacing past chats in the UI.

 ## 1. Prerequisites
 - Ensure you have a MongoDB Atlas cluster URI and a database named `Chatbot_v2` with a collection `Conversation`.
 - Environment variable (in `.env.local`):
   ```bash
   MONGODB_ATLAS_CLUSTER_URI="mongodb+srv://<USER>:<PASSWORD>@itgmongodbcluster01.wslj5.mongodb.net/Chatbot_v2?retryWrites=true&w=majority&appName=ITGMongoDBCluster01"
   ```
   > **Tip**: If your URI lacks the `/Chatbot_v2` path, append it after the host before the query string.

 ## 2. Install Dependencies **Already done**
 ```bash
 npm install mongodb @next-auth/mongodb-adapter
 ```

 ## 3. Create a Shared MongoDB Client
 1. **File**: `lib/mongodb.ts`
 2. **Purpose**: Reuse a single MongoClient across requests (avoids HMR reconnections).
 3. **Content**:
    ```ts
    import { MongoClient } from 'mongodb';

    if (!process.env.MONGODB_ATLAS_CLUSTER_URI) {
      throw new Error('Missing MONGODB_ATLAS_CLUSTER_URI');
    }
    const uri = process.env.MONGODB_ATLAS_CLUSTER_URI;
    let client: MongoClient;
    let clientPromise: Promise<MongoClient>;

    declare global { var _mongoClientPromise: Promise<MongoClient> }
    if (process.env.NODE_ENV === 'development') {
      if (!global._mongoClientPromise) {
        client = new MongoClient(uri);
        global._mongoClientPromise = client.connect();
      }
      clientPromise = global._mongoClientPromise;
    } else {
      client = new MongoClient(uri);
      clientPromise = client.connect();
    }

    export default clientPromise;
    ```

 ## 4. Configure NextAuth with MongoDB
 1. **File**: `app/api/auth/[...nextauth]/route.ts`
 2. **Changes**:
    ```ts
    import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
    import clientPromise from '@/lib/mongodb';

    export const authOptions = {
      adapter: MongoDBAdapter(clientPromise),
      // ...existing providers and settings...
      callbacks: {
        async jwt({ token, account }) { /* unchanged */ },
        async session({ session, token }) {
          session.user.id = token.sub; // persist user ID
          return session;
        }
      },
      secret: process.env.NEXTAUTH_SECRET,
    };
    ```

 ## 5. Implement Conversation Data Access
 1. **File**: `lib/conversations.ts`
 2. **Purpose**: CRUD operations for `Conversation` documents.
 3. **Content**:
    ```ts
    import clientPromise from './mongodb';
    import { ObjectId } from 'mongodb';

    export type Message = { role: 'user'|'assistant'; text: string; createdAt: Date };
    export type Conversation = {
      _id?: ObjectId;
      userId: string;
      title: string;
      messages: Message[];
      createdAt: Date;
      updatedAt: Date;
    };

    export async function getConversationsForUser(userId: string) {
      const client = await clientPromise;
      return client
        .db() // uses DB from URI
        .collection<Conversation>('Conversation')
        .find({ userId })
        .sort({ updatedAt: -1 })
        .toArray();
    }

    export async function createConversation(userId: string, title: string) {
      const client = await clientPromise;
      const convo: Conversation = { userId, title, messages: [], createdAt: new Date(), updatedAt: new Date() };
      const result = await client.db().collection('Conversation').insertOne(convo);
      return { ...convo, _id: result.insertedId };
    }

    export async function appendMessage(convoId: string, message: Message) {
      const client = await clientPromise;
      await client
        .db()
        .collection('Conversation')
        .updateOne(
          { _id: new ObjectId(convoId) },
          { $push: { messages: message }, $set: { updatedAt: new Date() } }
        );
    }
    ```

 ## 6. Add Conversations API Routes
 1. **File**: `app/api/conversations/route.ts`
 2. **Endpoints**:
    - `GET /api/conversations`: list a user's conversations
    - `POST /api/conversations`: create a new conversation
 3. **Content**:
    ```ts
    import { NextResponse } from 'next/server';
    import { getServerSession } from 'next-auth/next';
    import { authOptions } from '../auth/[...nextauth]/route';
    import { getConversationsForUser, createConversation } from '@/lib/conversations';

    export async function GET() {
      const session = await getServerSession(authOptions);
      if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      const convos = await getConversationsForUser(session.user.id);
      return NextResponse.json(convos);
    }

    export async function POST(req: Request) {
      const session = await getServerSession(authOptions);
      if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      const { title } = await req.json();
      const convo = await createConversation(session.user.id, title || 'New Chat');
      return NextResponse.json(convo);
    }
    ```

 ## 7. Update Sidebar to Fetch Real Conversations
 - Convert `components/Sidebar.tsx` to fetch `/api/conversations` using Fetch/SWR/React Query.
 - Render dynamic list instead of mock data.
 - Add a "New Chat" button that `POST /api/conversations` and appends to the list.

 ## 8. Persist Chat Messages
 - In `app/api/chat/route.ts`, after generating the AI response, call `appendMessage(convoId, { role, text, createdAt: new Date() })`.

 ## 9. Testing & Verification
 1. Run `npm run dev`, log in, create new chats.
 2. Verify documents appear in Atlas UI under `Chatbot_v2.Conversation`.
 3. Ensure each user only sees their own conversations in the sidebar.

 Completing these steps will give you a fully integrated MongoDB-backed chat history per user, surfaced in your Next.js UI.