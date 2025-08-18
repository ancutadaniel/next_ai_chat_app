import { auth } from '@/auth';

export default async function Home() {
  const session = await auth();

  // If the user is not logged in, show a generic welcome message.
  if (!session) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <h1 className="text-3xl font-bold">Welcome to AI Chat</h1>
        <p className="mt-2 text-lg text-[var(--studio-text-secondary)]">
          Please sign in to start chatting.
        </p>
      </div>
    );
  }

  // If the user IS logged in, welcome them by name and prompt to start a new chat.
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <h1 className="text-3xl font-bold">Welcome, {session.user?.name}!</h1>
      <p className="mt-2 text-lg text-[var(--studio-text-secondary)]">
        Select a conversation or start a &quot;New chat&quot; from the sidebar.
      </p>
    </div>
  );
}