'use client';

import React from 'react';
import { useSidebar } from './SidebarProvider';

export default function MobileHeader() {
  const { toggle } = useSidebar();

  return (
    <div className="flex items-center border-b border-[var(--studio-border)] bg-black px-4 py-2 md:hidden">
      <button
        onClick={toggle}
        className="rounded-md p-2 text-[var(--studio-text-secondary)] hover:bg-white/10"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
          <path fillRule="evenodd" d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
        </svg>
      </button>
      <span className="ml-3 text-sm font-medium text-[var(--studio-text-primary)]">W3B AI Chat</span>
    </div>
  );
}
