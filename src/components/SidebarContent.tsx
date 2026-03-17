'use client';

import React from 'react';
import { useSidebar } from './SidebarProvider';
import { createNewChat } from '@/app/actions';
import HistoryItem from './HistoryItem';
import SignInButton from './SignInButton';
import SignOutButton from './SignOutButton';
import SearchInput from './SearchInput';

function PlusIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
    </svg>
  );
}

interface SidebarContentProps {
  session: {
    user?: {
      name?: string | null;
      id?: string;
    };
  } | null;
  history: { id: string; title: string }[];
}

export default function SidebarContent({ session, history }: SidebarContentProps) {
  const { isOpen, close } = useSidebar();
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredHistory = searchQuery
    ? history.filter((chat) =>
        chat.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : history;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={close}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-[var(--studio-sidebar)] border-r border-[var(--studio-border)] p-2 transition-transform duration-300 md:static md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <form action={createNewChat}>
          <button
            type="submit"
            className="w-full mb-2 flex items-center gap-3 rounded-md p-3 text-sm hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!session}
            onClick={close}
          >
            <PlusIcon />
            New chat
          </button>
        </form>

        {session && history.length > 0 && (
          <SearchInput value={searchQuery} onChange={setSearchQuery} />
        )}

        <div className="flex-1 space-y-1 overflow-y-auto">
          {filteredHistory.map((chat) => (
            <HistoryItem key={chat.id} chat={chat} onNavigate={close} />
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
    </>
  );
}
