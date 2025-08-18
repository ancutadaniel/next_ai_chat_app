'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { randomUUID } from 'crypto';
import { eq } from 'drizzle-orm';
import { unstable_noStore as noStore } from 'next/cache';

// UPDATED IMPORT
import { auth, signIn, signOut } from '@/auth';

// Database and schema imports
import { db } from '@/db';
import { conversations, messages } from '@/db/schema';

// AI SDK import
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function createNewChat() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized: Please sign in to create a chat.');
  }
  const userId = session.user.id;
  const newConversationId = randomUUID();

  await db.insert(conversations).values({
    id: newConversationId,
    userId: userId,
    title: 'New Chat',
  });

  await db.insert(messages).values({
    id: randomUUID(),
    conversationId: newConversationId,
    role: 'assistant',
    content: 'Hello! How can I assist you today?',
  });
  
  redirect(`/chat/${newConversationId}`);
}

export async function getChatHistory() {
  noStore();
  const session = await auth();
  if (!session?.user?.id) return [];
  
  const userConversations = await db
    .select({ id: conversations.id, title: conversations.title })
    .from(conversations)
    .where(eq(conversations.userId, session.user.id));
    
  return userConversations;
}

export async function getConversation(id: string) {
  const session = await auth();
  if (!session?.user?.id) return null;

  const conversation = await db.query.conversations.findFirst({
    where: eq(conversations.id, id),
  });

  if (!conversation || conversation.userId !== session.user.id) {
    return null;
  }
  
  const conversationMessages = await db.query.messages.findMany({
    where: eq(messages.conversationId, id),
    orderBy: (messages, { asc }) => [asc(messages.createdAt)],
  });

  return {
    ...conversation,
    messages: conversationMessages,
  };
}

export async function sendMessageAction(formData: FormData) {
  const session = await auth();
  const userInput = formData.get('message') as string;
  const conversationId = formData.get('conversationId') as string;

  if (!session?.user?.id || !userInput.trim() || !conversationId) return;

  await db.insert(messages).values({
    id: randomUUID(),
    conversationId: conversationId,
    role: 'user',
    content: userInput,
  });

  const currentConversation = await getConversation(conversationId);
  if (!currentConversation) return;

  if (currentConversation.messages.length === 2 && currentConversation.title === 'New Chat') {
    const newTitle = userInput.substring(0, 30) + (userInput.length > 30 ? '...' : '');
    await db.update(conversations)
      .set({ title: newTitle })
      .where(eq(conversations.id, conversationId));
  }

  try {
    const completion = await groq.chat.completions.create({
      messages: currentConversation.messages.map(({ role, content }) => ({ role, content })),
      model: 'llama3-8b-8192',
    });
    const aiResponse = completion.choices[0]?.message?.content || 'Sorry, I had trouble with that.';
    
    await db.insert(messages).values({
      id: randomUUID(),
      conversationId: conversationId,
      role: 'assistant',
      content: aiResponse,
    });

  } catch (error) {
    console.error('Groq API call failed:', error);
  }

  revalidatePath(`/chat/${conversationId}`);
  revalidatePath('/');
}

export { signInAction, signOutAction };

async function signInAction() {
  await signIn('github', { redirectTo: '/' });
}

async function signOutAction() {
  await signOut({ redirectTo: '/' });
}