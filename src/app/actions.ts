'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { randomUUID } from 'crypto';
import { eq } from 'drizzle-orm';
import { unstable_noStore as noStore } from 'next/cache';
import { auth, signIn, signOut } from '@/auth';
import { db } from '@/db';
import { conversations, messages } from '@/db/schema';

export async function createNewChat() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized: Please sign in to create a chat.');
  }

  const newConversationId = randomUUID();

  await db.insert(conversations).values({
    id: newConversationId,
    userId: session.user.id,
    title: 'New Chat',
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

export async function deleteConversation(conversationId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const conversation = await db.query.conversations.findFirst({
    where: eq(conversations.id, conversationId),
  });

  if (conversation?.userId !== session.user.id) {
    throw new Error('Forbidden');
  }

  await db.delete(conversations).where(eq(conversations.id, conversationId));

  revalidatePath('/');
  redirect('/');
}

export async function updateConversationTitle(conversationId: string, title: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  await db
    .update(conversations)
    .set({ title })
    .where(eq(conversations.id, conversationId));

  revalidatePath('/');
}

export async function updateConversationSettings(
  conversationId: string,
  settings: { model?: string; provider?: string; systemPrompt?: string | null }
) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  await db
    .update(conversations)
    .set(settings)
    .where(eq(conversations.id, conversationId));

  revalidatePath(`/chat/${conversationId}`);
}

export async function signInAction() {
  await signIn('github', { redirectTo: '/' });
}

export async function signOutAction() {
  await signOut({ redirectTo: '/' });
}
