'use client';

import React from 'react';
import ArrowUpIcon from './icons/ArrowUpIcon';

// This component no longer needs props or state. It's just a "dumb" UI component.
const ChatInput = () => {
  return (
    <div className="p-4">
      <div className="relative mx-auto max-w-4xl">
      <input
        type="text"
        name="message"
        placeholder="Enter a prompt here..."
        className="w-full rounded-full border border-transparent bg-white/5 p-4 pr-12 text-[var(--studio-text-primary)] transition-all focus:border-[var(--studio-border)] focus:bg-[var(--studio-sidebar)] focus:outline-none focus:ring-2 focus:ring-[var(--studio-accent)]/50"
        autoComplete="off"
      />
        <button
          type="submit"
          className="absolute inset-y-0 right-0 flex h-full w-12 items-center justify-center text-gray-400 hover:text-white"
        >
          <ArrowUpIcon />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;