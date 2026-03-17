import { streamText, UIMessage, convertToModelMessages } from 'ai';
import { randomUUID } from 'crypto';
import { eq } from 'drizzle-orm';
import { auth } from '@/auth';
import { db } from '@/db';
import { conversations, messages } from '@/db/schema';
import { getModel } from '@/lib/ai/providers';

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response('Unauthorized', { status: 401 });
  }

  const body = await req.json();
  const {
    messages: chatMessages,
    conversationId,
    model: modelId = 'llama-3.3-70b-versatile',
    provider = 'groq',
    systemPrompt,
  } = body as {
    messages: UIMessage[];
    conversationId: string;
    model?: string;
    provider?: string;
    systemPrompt?: string;
  };

  if (!conversationId) {
    return new Response('Missing conversationId', { status: 400 });
  }

  // Verify user owns this conversation
  const conversation = await db.query.conversations.findFirst({
    where: eq(conversations.id, conversationId),
  });

  if (!conversation || conversation.userId !== session.user.id) {
    return new Response('Forbidden', { status: 403 });
  }

  // Extract user message text from the last message
  const lastMessage = chatMessages[chatMessages.length - 1];
  let userMessageText = '';
  if (lastMessage?.role === 'user') {
    userMessageText =
      lastMessage.parts
        ?.filter((p): p is { type: 'text'; text: string } => p.type === 'text')
        .map((p) => p.text)
        .join('') || '';

    if (userMessageText) {
      await db.insert(messages).values({
        id: randomUUID(),
        conversationId,
        role: 'user',
        content: userMessageText,
      });
    }
  }

  const aiModel = getModel(provider, modelId);

  const systemContent = systemPrompt || 'You are a helpful, accurate, and concise AI assistant.';

  const modelMessages = await convertToModelMessages(chatMessages);

  const result = streamText({
    model: aiModel,
    system: systemContent,
    messages: modelMessages,
    onFinish: async ({ text }) => {
      // Save assistant message
      await db.insert(messages).values({
        id: randomUUID(),
        conversationId,
        role: 'assistant',
        content: text,
        model: modelId,
      });

      // Auto-generate title if this is a new chat
      if (conversation.title === 'New Chat') {
        try {
          const { generateText } = await import('ai');
          const titleModel = getModel('groq', 'llama-3.1-8b-instant');
          const titleResult = await generateText({
            model: titleModel,
            messages: [
              {
                role: 'user',
                content: `Generate a concise 3-5 word title for this conversation. Only respond with the title, nothing else.\n\nUser: ${userMessageText}\nAssistant: ${text.substring(0, 200)}`,
              },
            ],
            maxOutputTokens: 20,
          });
          const title = titleResult.text.replace(/["']/g, '').trim().substring(0, 50);
          if (title) {
            await db
              .update(conversations)
              .set({ title })
              .where(eq(conversations.id, conversationId));
          }
        } catch {
          const fallbackTitle =
            (userMessageText.substring(0, 30) || 'Chat') +
            (userMessageText.length > 30 ? '...' : '');
          await db
            .update(conversations)
            .set({ title: fallbackTitle })
            .where(eq(conversations.id, conversationId));
        }
      }
    },
  });

  return result.toUIMessageStreamResponse();
}
