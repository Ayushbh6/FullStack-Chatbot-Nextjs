import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { getConversation, appendMessage, type Message } from '@/lib/conversations';
import openai from '@/lib/openai';

/**
 * POST /api/chat
 * Accepts { conversationId, input } in the request body,
 * records the user message, queries OpenAI, records the assistant message,
 * and returns the assistant's response.
 */
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { conversationId, input } = await req.json();
  if (!conversationId || !input) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  let convo;
  let historyInputs: { role: string; content: string }[] = [];
  
  // Load the conversation for this user
  try {
    console.log(`Loading conversation ${conversationId} for user ${session.user.id}`);
    convo = await getConversation(session.user.id!, conversationId);
    if (!convo) {
      console.error(`Conversation ${conversationId} not found for user ${session.user.id}`);
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    console.log(`Conversation found with ${convo.messages.length} messages`);

    // Build the message history for OpenAI
    historyInputs = convo.messages.map((msg) => ({
      role: msg.role,
      content: msg.text,
    }));
  } catch (error) {
    console.error('Error loading conversation:', error);
    return NextResponse.json({ error: 'Failed to load conversation' }, { status: 500 });
  }

  // Create new user message
  const userMessage: Message = { role: 'user', text: input, createdAt: new Date() };
  historyInputs.push({
    role: 'user',
    content: input,
  });

  // Add user message to database and stream assistant response
  try {
    console.log(`Adding user message to conversation ${conversationId}`);
    await appendMessage(conversationId, userMessage);
    console.log('User message added successfully');

    // Construct the conversation history for OpenAI by joining all messages
    const fullConversationContext = historyInputs
      .map((msg) => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n\n');
    const prompt = `The following is a conversation between a user and an AI assistant.\n\n${fullConversationContext}\n\nAssistant:`;

    // Call OpenAI with streaming enabled
    const stream = await openai.responses.create({
      model: 'gpt-4.1',
      input: prompt,
      stream: true,
    });

    const encoder = new TextEncoder();
    let assistantText = '';

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (event.type === 'response.output_text.delta' && event.delta) {
              const chunk = event.delta;
              assistantText += chunk;
              controller.enqueue(encoder.encode(chunk));
            }
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }

        // Append full assistant message to database
        try {
          const assistantMessage: Message = {
            role: 'assistant',
            text: assistantText,
            createdAt: new Date(),
          };
          await appendMessage(conversationId, assistantMessage);
          console.log('Assistant message added successfully');
        } catch (dbError) {
          console.error('Error appending assistant message:', dbError);
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  } catch (error) {
    console.error('Error in chat processing:', error);
    return NextResponse.json({ error: 'API error' }, { status: 500 });
  }
}
