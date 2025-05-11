import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { getConversationsForUser, createConversation, deleteConversation, updateConversationTitle } from '@/lib/conversations';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    console.error('GET /api/conversations - Unauthorized session');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    console.log(`Fetching conversations for user: ${session.user.id}`);
    const convos = await getConversationsForUser(session.user.id!);
    console.log(`Found ${convos.length} conversations`);
    return NextResponse.json(convos);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    console.error('POST /api/conversations - Unauthorized session');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const { title } = await req.json();
    console.log(`Creating conversation for user: ${session.user.id}, title: ${title || 'New Conversation'}`);
    const convo = await createConversation(session.user.id!, title || 'New Conversation');
    console.log(`Created conversation with ID: ${convo._id}`);
    return NextResponse.json(convo);
  } catch (error) {
    console.error('Error creating conversation:', error);
    return NextResponse.json({ error: 'Failed to create conversation' }, { status: 500 });
  }
}

/**
 * DELETE /api/conversations
 * Delete a conversation by id for the authenticated user.
 */
export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    console.error('DELETE /api/conversations - Unauthorized session');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const { id } = await req.json();
    if (!id) {
      console.error('DELETE /api/conversations - Missing conversation id');
      return NextResponse.json({ error: 'Missing conversation id' }, { status: 400 });
    }
    
    console.log(`Deleting conversation ${id} for user ${session.user.id}`);
    const deletedCount = await deleteConversation(session.user.id!, id);
    
    if (deletedCount === 0) {
      console.error(`Conversation ${id} not found for user ${session.user.id}`);
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }
    
    console.log(`Successfully deleted conversation ${id}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting conversation:', error);
    return NextResponse.json({ error: 'Failed to delete conversation' }, { status: 500 });
  }
}

/**
 * PATCH /api/conversations
 * Rename a conversation title.
 */
export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    console.error('PATCH /api/conversations - Unauthorized session');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const { id, title } = await req.json();
    if (!id || typeof title !== 'string') {
      console.error(`PATCH /api/conversations - Invalid parameters: id=${id}, title type=${typeof title}`);
      return NextResponse.json({ error: 'Missing id or title' }, { status: 400 });
    }
    
    console.log(`Updating title for conversation ${id} to "${title}" for user ${session.user.id}`);
    const updated = await updateConversationTitle(session.user.id!, id, title);
    
    if (!updated) {
      console.error(`Failed to update title for conversation ${id}`);
      return NextResponse.json({ error: 'Conversation not found or not updated' }, { status: 404 });
    }
    
    console.log(`Successfully updated title for conversation ${id}`);
    return NextResponse.json({ id, title });
  } catch (error) {
    console.error('Error updating conversation title:', error);
    return NextResponse.json({ error: 'Failed to update conversation title' }, { status: 500 });
  }
}