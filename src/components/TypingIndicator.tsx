import React from 'react';
import SparklesIcon from './icons/SparklesIcon';

export default function TypingIndicator() {
  return (
    <div className="py-6">
      <div className="mx-auto flex max-w-4xl gap-4 px-4">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[var(--studio-sidebar)] p-1">
          <SparklesIcon />
        </div>
        <div className="flex items-center gap-1 pt-2">
          <span className="typing-dot h-2 w-2 rounded-full bg-[var(--studio-text-secondary)]" />
          <span className="typing-dot h-2 w-2 rounded-full bg-[var(--studio-text-secondary)]" />
          <span className="typing-dot h-2 w-2 rounded-full bg-[var(--studio-text-secondary)]" />
        </div>
      </div>
    </div>
  );
}
