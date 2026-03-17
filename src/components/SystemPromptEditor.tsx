'use client';

import React, { useState } from 'react';

interface SystemPromptEditorProps {
  systemPrompt: string;
  onSystemPromptChange: (prompt: string) => void;
}

export default function SystemPromptEditor({
  systemPrompt,
  onSystemPromptChange,
}: SystemPromptEditorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-lg border border-[var(--studio-border)] bg-[var(--studio-sidebar)] px-3 py-1.5 text-sm text-[var(--studio-text-secondary)] outline-none transition-colors hover:border-[var(--studio-accent)]/50"
        title="System prompt"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
          <path fillRule="evenodd" d="M7.84 1.804A1 1 0 0 1 8.82 1h2.36a1 1 0 0 1 .98.804l.331 1.652a6.993 6.993 0 0 1 1.929 1.115l1.598-.54a1 1 0 0 1 1.186.447l1.18 2.044a1 1 0 0 1-.205 1.251l-1.267 1.113a7.047 7.047 0 0 1 0 2.228l1.267 1.113a1 1 0 0 1 .206 1.25l-1.18 2.045a1 1 0 0 1-1.187.447l-1.598-.54a6.993 6.993 0 0 1-1.929 1.115l-.33 1.652a1 1 0 0 1-.98.804H8.82a1 1 0 0 1-.98-.804l-.331-1.652a6.993 6.993 0 0 1-1.929-1.115l-1.598.54a1 1 0 0 1-1.186-.447l-1.18-2.044a1 1 0 0 1 .205-1.251l1.267-1.114a7.05 7.05 0 0 1 0-2.227L1.821 7.773a1 1 0 0 1-.206-1.25l1.18-2.045a1 1 0 0 1 1.187-.447l1.598.54A6.992 6.992 0 0 1 7.51 3.456l.33-1.652ZM10 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 z-50 mt-2 w-80 rounded-lg border border-[var(--studio-border)] bg-[var(--studio-sidebar)] p-4 shadow-xl">
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-[var(--studio-text-primary)]">
              System Prompt
            </label>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[var(--studio-text-secondary)] hover:text-[var(--studio-text-primary)]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
              </svg>
            </button>
          </div>
          <textarea
            value={systemPrompt}
            onChange={(e) => onSystemPromptChange(e.target.value)}
            placeholder="You are a helpful, accurate, and concise AI assistant."
            rows={4}
            className="w-full resize-none rounded-md border border-[var(--studio-border)] bg-black/30 p-2 text-sm text-[var(--studio-text-primary)] placeholder:text-[var(--studio-text-secondary)]/50 outline-none focus:border-[var(--studio-accent)]"
          />
          <p className="mt-1 text-xs text-[var(--studio-text-secondary)]/50">
            Instructions that guide the AI&apos;s behavior for this conversation.
          </p>
        </div>
      )}
    </div>
  );
}
