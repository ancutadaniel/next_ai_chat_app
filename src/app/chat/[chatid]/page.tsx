import { getConversation } from '@/app/actions';
import Chat from '@/components/Chat';
import { auth } from '@/app/api/auth/[...nextauth]/route';

interface PageProps {
  // The params prop is now a Promise
  params: Promise<{
    chatId: string;
  }>;
}

export default async function ChatPage({ params }: PageProps) {
  const session = await auth();
  if (!session) {
    return <div>Please sign in to view your chats.</div>;
  }

  // Await the params promise to get the resolved object
  const resolvedParams = await params;
  const conversation = await getConversation(resolvedParams.chatId);

  if (!conversation) {
    return <div>Chat not found or you do not have permission to view it.</div>;
  }

  return <Chat initialMessages={conversation.messages} conversationId={conversation.id} />;
}