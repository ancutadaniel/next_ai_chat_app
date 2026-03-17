import { getConversation } from '@/app/actions';
import Chat from '@/components/Chat';
import { auth } from '@/auth';

interface PageProps {
  params: Promise<{
    chatId: string;
  }>;
}

export default async function ChatPage({ params }: PageProps) {
  const session = await auth();
  if (!session) {
    return <div className="flex h-full items-center justify-center text-[var(--studio-text-secondary)]">Please sign in to view your chats.</div>;
  }

  const resolvedParams = await params;
  const conversation = await getConversation(resolvedParams.chatId);
  if (!conversation) {
    return <div className="flex h-full items-center justify-center text-[var(--studio-text-secondary)]">Chat not found or you do not have permission to view it.</div>;
  }

  return (
    <Chat
      initialMessages={conversation.messages.map((m) => ({
        id: m.id,
        role: m.role as 'user' | 'assistant',
        content: m.content,
        model: m.model,
      }))}
      conversationId={conversation.id}
      initialModel={conversation.model ?? undefined}
      initialProvider={conversation.provider ?? undefined}
      initialSystemPrompt={conversation.systemPrompt}
    />
  );
}
