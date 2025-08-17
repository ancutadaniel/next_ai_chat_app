// In: src/app/chat/[chatId]/page.tsx
import { getConversation } from '@/app/actions';
import Chat from '@/components/Chat';
import { auth } from '@/app/api/auth/[...nextauth]/route';

interface ChatPageProps {
  params: {
    chatId: string;
  };
}

export default async function ChatPage({ params }: ChatPageProps) {
  const session = await auth();
  if (!session) {
    // You can add a redirect here if you want
    return <div>Please sign in to view your chats.</div>;
  }

  const conversation = await getConversation(params.chatId);

  if (!conversation) {
    return <div>Chat not found.</div>;
  }

  return <Chat initialMessages={conversation.messages} conversationId={conversation.id} />;
}