'use client';

import React from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import ArrowUpIcon from './icons/ArrowUpIcon';

interface ChatInputProps {
  input: string;
  onInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  onStop: () => void;
}

export default function ChatInput({
  input,
  onInputChange,
  onSubmit,
  isLoading,
  onStop,
}: ChatInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading) {
        const form = e.currentTarget.form;
        if (form) {
          form.requestSubmit();
        }
      }
    }
  };

  return (
    <div className="p-4">
      <div className="relative mx-auto max-w-4xl">
        {isLoading && (
          <div className="mb-2 flex justify-center">
            <button
              type="button"
              onClick={onStop}
              className="rounded-full border border-[var(--studio-border)] bg-[var(--studio-sidebar)] px-4 py-1.5 text-sm text-[var(--studio-text-secondary)] transition-colors hover:bg-white/10"
            >
              Stop generating
            </button>
          </div>
        )}
        <form onSubmit={onSubmit}>
          <div className="relative">
            <TextareaAutosize
              value={input}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter a prompt here..."
              minRows={1}
              maxRows={6}
              className="w-full resize-none rounded-2xl border border-transparent bg-white/5 p-4 pr-12 text-[var(--studio-text-primary)] transition-all focus:border-[var(--studio-border)] focus:bg-[var(--studio-sidebar)] focus:outline-none focus:ring-2 focus:ring-[var(--studio-accent)]/50"
              autoComplete="off"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute bottom-3 right-3 flex items-center justify-center text-gray-400 transition-colors hover:text-white disabled:opacity-30 disabled:hover:text-gray-400"
            >
              <ArrowUpIcon />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
