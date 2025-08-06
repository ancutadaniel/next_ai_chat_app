// In: src/components/Sidebar.tsx
import React from 'react';
import { auth } from '@/app/api/auth/[...nextauth]/route';
import SignInButton from './SignInButton';
import SignOutButton from './SignOutButton';
import Link from 'next/link';

// The PlusIcon component remains the same
function PlusIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
    </svg>
  );
}

export default async function Sidebar() {
  const session = await auth();

  return (
    // Use CSS variables for background and border color
    <div className="flex h-full w-64 flex-col bg-[var(--studio-sidebar)] p-2 border-r border-[var(--studio-border)]">
      <Link href="/" className="mb-2 flex items-center gap-3 rounded-md p-3 text-sm hover:bg-white/10">
        <PlusIcon />
        New chat
      </Link>

      <div className="flex-1 space-y-2 overflow-y-auto">
        <div className="p-3 text-sm text-[var(--studio-text-secondary)]">History coming soon...</div>
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