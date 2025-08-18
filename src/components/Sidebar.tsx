import React from 'react';
import Link from 'next/link';
import { auth } from '@/app/api/auth/[...nextauth]/route';
import { createNewChat, getChatHistory } from '@/app/actions';
import SignInButton from './SignInButton';
import SignOutButton from './SignOutButton';

function PlusIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
    </svg>
  );
}

export default async function Sidebar() {
  const session = await auth();
  const history = session ? await getChatHistory() : [];

  return (
    <div className="flex h-full w-64 flex-col bg-[var(--studio-sidebar)] p-2 border-r border-[var(--studio-border)]">
      <form action={createNewChat}>
      <button
          type="submit"
          // Add the disabled: variants to this className string
          className="w-full mb-2 flex items-center gap-3 rounded-md p-3 text-sm hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!session}
        >
          <PlusIcon />
          New chat
        </button>
      </form>

      <div className="flex-1 space-y-1 overflow-y-auto">
        {history.map((chat) => (
          <Link
            key={chat.id}
            href={`/chat/${chat.id}`}
            className="block rounded-md p-3 text-sm text-[var(--studio-text-secondary)] hover:bg-white/10 truncate"
          >
            {chat.title}
          </Link>
        ))}
      </div>

      <div className="border-t border-[var(--studio-border)] p-2">
        <div className="flex items-center justify-center p-2">
          {session?.user ? (
            <SignOutButton userName={session.user.name ?? 'User'} />
          ) : (
            <SignInButton />
          )}
        </div>
      </div>
    </div>
  );
}