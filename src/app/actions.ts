// In: src/app/actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation'; // Import redirect
import type { Conversation } from '@/types'; // Import Conversation
import { signIn, signOut } from '@/app/api/auth/[...nextauth]/route';
import Groq from 'groq-sdk';
import { randomUUID } from 'crypto'; // Import for generating unique IDs

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Our new in-memory "database"
const conversations: Conversation[] = [];

// --- NEW ACTIONS ---

// Action to create a new, empty chat
export async function createNewChat() {
  const newConversation: Conversation = {
    id: randomUUID(),
    title: 'New Chat',
    messages: [
      { role: 'assistant', content: 'Hello! How can I assist you today?' },
    ],
  };
  conversations.push(newConversation);
  // Redirect the user to the new chat's page
  redirect(`/chat/${newConversation.id}`);
}

// Action to get the list of all chat titles for the history
export async function getChatHistory() {
  // In a real app, you'd just select the id and title
  return conversations.map(({ id, title }) => ({ id, title }));
}

// Action to get a specific conversation by its ID
export async function getConversation(id: string) {
  return conversations.find((convo) => convo.id === id);
}


// --- MODIFIED ACTION ---

export async function sendMessageAction(formData: FormData) {
  const userInput = formData.get('message') as string;
  const conversationId = formData.get('conversationId') as string; // Get the conversation ID from the form

  if (!userInput || !conversationId) return;

  const conversation = await getConversation(conversationId);
  if (!conversation) return;

  conversation.messages.push({ role: 'user', content: userInput });

  // Generate a title for the conversation from the first user message
  if (conversation.messages.length === 2 && conversation.title === 'New Chat') {
      conversation.title = userInput.substring(0, 30) + (userInput.length > 30 ? '...' : '');
  }

  try {
    const completion = await groq.chat.completions.create({
      messages: conversation.messages, // Send the whole conversation
      model: 'llama3-8b-8192',
    });
    const aiResponse = completion.choices[0]?.message?.content || 'Sorry, I had trouble thinking of a response.';
    conversation.messages.push({ role: 'assistant', content: aiResponse });
  } catch (error) {
    console.error('Groq API call failed:', error);
    conversation.messages.push({ role: 'assistant', content: 'Sorry, I couldn\'t connect to the AI.' });
  }

  // Revalidate the specific chat path and the layout (for the history)
  revalidatePath(`/chat/${conversationId}`);
  revalidatePath('/');
}

export async function signInAction() {
  await signIn('github', { redirectTo: '/' });
}

export async function signOutAction() {
  await signOut({ redirectTo: '/' });
}