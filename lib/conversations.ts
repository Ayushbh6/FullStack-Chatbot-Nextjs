import clientPromise from './mongodb';
import { ObjectId } from 'mongodb';

export type Message = {
  role: 'user' | 'assistant';
  text: string;
  createdAt: Date;
};

export type Conversation = {
  _id?: ObjectId;
  userId: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
};

/** Retrieve all conversations for a given user, sorted by most recent. */
export async function getConversationsForUser(userId: string) {
  if (!userId) {
    console.error('getConversationsForUser called with empty userId');
    throw new Error('userId is required');
  }

  try {
    console.log(`Getting conversations for user: ${userId}`);
    const client = await clientPromise;
    const result = await client
      .db() // uses the database specified in the URI
      .collection<Conversation>('Conversation')
      .find({ userId })
      .sort({ updatedAt: -1 })
      .toArray();
    
    console.log(`Found ${result.length} conversations for user ${userId}`);
    return result;
  } catch (error) {
    console.error(`Error getting conversations for user ${userId}:`, error);
    throw error;
  }
}
 
/**
 * Retrieve a single conversation by ID, scoped to the given user.
 * Returns null if not found or not owned by the user.
 */
export async function getConversation(userId: string, convoId: string): Promise<Conversation | null> {
  if (!userId || !convoId) {
    console.error(`getConversation called with invalid params - userId: ${userId}, convoId: ${convoId}`);
    throw new Error('userId and convoId are required');
  }

  try {
    console.log(`Getting conversation ${convoId} for user ${userId}`);
    const client = await clientPromise;
    const result = await client
      .db()
      .collection<Conversation>('Conversation')
      .findOne({ _id: new ObjectId(convoId), userId });
    
    console.log(`Conversation ${convoId} found: ${result !== null}`);
    return result;
  } catch (error) {
    console.error(`Error getting conversation ${convoId} for user ${userId}:`, error);
    throw error;
  }
}

/** Create a new conversation for the user with an initial title. */
export async function createConversation(userId: string, title: string) {
  if (!userId) {
    console.error('createConversation called with empty userId');
    throw new Error('userId is required');
  }

  try {
    console.log(`Creating conversation for user ${userId} with title "${title}"`);
    const client = await clientPromise;
    const convo: Conversation = {
      userId,
      title,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await client
      .db()
      .collection('Conversation')
      .insertOne(convo);
    
    console.log(`Created conversation with ID ${result.insertedId} for user ${userId}`);
    return { ...convo, _id: result.insertedId };
  } catch (error) {
    console.error(`Error creating conversation for user ${userId}:`, error);
    throw error;
  }
}

/** Append a message to the conversation and update the timestamp. */
export async function appendMessage(convoId: string, message: Message) {
  if (!convoId) {
    console.error('appendMessage called with empty convoId');
    throw new Error('convoId is required');
  }

  try {
    console.log(`Appending ${message.role} message to conversation ${convoId}`);
    const client = await clientPromise;
    const result = await client
      .db()
      .collection<Conversation>('Conversation')
      .updateOne(
        { _id: new ObjectId(convoId) },
        { $push: { messages: message }, $set: { updatedAt: new Date() } }
      );
    
    console.log(`Message append result: modified=${result.modifiedCount}, matched=${result.matchedCount}`);
    if (result.matchedCount === 0) {
      throw new Error(`Conversation ${convoId} not found`);
    }
    if (result.modifiedCount === 0) {
      console.warn(`Message not appended to conversation ${convoId}`);
    }
  } catch (error) {
    console.error(`Error appending message to conversation ${convoId}:`, error);
    throw error;
  }
}

/**
 * Delete a conversation by its ID for the given user.
 * @returns number of deleted documents (0 or 1)
 */
export async function deleteConversation(userId: string, convoId: string): Promise<number> {
  if (!userId || !convoId) {
    console.error(`deleteConversation called with invalid params - userId: ${userId}, convoId: ${convoId}`);
    throw new Error('userId and convoId are required');
  }

  try {
    console.log(`Deleting conversation ${convoId} for user ${userId}`);
    const client = await clientPromise;
    const result = await client
      .db()
      .collection<Conversation>('Conversation')
      .deleteOne({ _id: new ObjectId(convoId), userId });
    
    console.log(`Delete result: deleted=${result.deletedCount}`);
    return result.deletedCount ?? 0;
  } catch (error) {
    console.error(`Error deleting conversation ${convoId} for user ${userId}:`, error);
    throw error;
  }
}

/**
 * Rename a conversation title for the given user.
 * Returns true if a document was modified.
 */
export async function updateConversationTitle(
  userId: string,
  convoId: string,
  title: string
): Promise<boolean> {
  if (!userId || !convoId || !title) {
    console.error(`updateConversationTitle called with invalid params - userId: ${userId}, convoId: ${convoId}, title: ${title}`);
    throw new Error('userId, convoId, and title are required');
  }

  try {
    console.log(`Updating title for conversation ${convoId} to "${title}" for user ${userId}`);
    const client = await clientPromise;
    const result = await client
      .db()
      .collection<Conversation>('Conversation')
      .updateOne(
        { _id: new ObjectId(convoId), userId },
        { $set: { title, updatedAt: new Date() } }
      );
    
    console.log(`Update title result: modified=${result.modifiedCount}, matched=${result.matchedCount}`);
    return result.modifiedCount > 0;
  } catch (error) {
    console.error(`Error updating title for conversation ${convoId}:`, error);
    throw error;
  }
}