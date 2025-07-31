import { auth } from '@/app/api/auth/[...nextauth]/route';
import Chat from '@/components/Chat';
import { getMessages } from './actions';

export default async function Home() {
  const session = await auth();

  // If there's no session, the user is not logged in.
  if (!session) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-white">
        <h1 className="text-3xl font-bold">Welcome to AI Chat</h1>
        <p className="mt-2 text-lg text-gray-400">
          Please sign in to start chatting.
        </p>
      </div>
    );
  }

  // If the user is logged in, show the chat interface.
  const initialMessages = await getMessages();
  return <Chat initialMessages={initialMessages} />;
}