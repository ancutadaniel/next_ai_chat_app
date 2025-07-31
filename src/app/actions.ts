'use server';

import { revalidatePath } from 'next/cache';
import type { Message } from '@/components/ChatMessage';
// Import the TRUE server-side functions from our own auth config file
import { signIn, signOut } from '@/app/api/auth/[...nextauth]/route';

// --- CHAT ACTIONS (No changes needed here) ---
const messages: Message[] = [
  { role: 'assistant', content: 'Hello! How can I assist you today?' },
];
export async function sendMessageAction(formData: FormData) {
  const userInput = formData.get('message') as string;
  if (!userInput || userInput.trim() === '') {
    return;
  }
  messages.push({ role: 'user', content: userInput });
  const aiResponse = `This is a simulated AI response to: "${userInput}"`;
  messages.push({ role: 'assistant', content: aiResponse });
  revalidatePath('/');
}
export async function getMessages() {
  return messages;
}


// --- AUTH ACTIONS (Now using the correct imports) ---
export async function signInAction() {
  await signIn('github', { redirectTo: '/' });
}

export async function signOutAction() {
  await signOut({ redirectTo: '/' });
}