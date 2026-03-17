'use client';

import React, { useState } from 'react';
import UserIcon from './icons/UserIcon';
import SparklesIcon from './icons/SparklesIcon';
import MarkdownRenderer from './MarkdownRenderer';

interface ChatMessageProps {
  message: {
    role: string;
    content: string;
    model?: string;
  };
  isLast?: boolean;
  onRegenerate?: () => void;
}

export default function ChatMessage({ message, isLast, onRegenerate }: ChatMessageProps) {
  const isAIMessage = message.role === 'assistant';
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group py-6">
      <div className="mx-auto flex max-w-4xl gap-4 px-4">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[var(--studio-sidebar)] p-1">
          {isAIMessage ? <SparklesIcon /> : <UserIcon />}
        </div>
        <div className="min-w-0 flex-1 pt-1">
          {isAIMessage ? (
            <div className="prose prose-invert max-w-none">
              <MarkdownRenderer content={message.content} />
            </div>
          ) : (
            <div className="prose prose-invert max-w-none whitespace-pre-wrap">
              {message.content}
            </div>
          )}

          {/* Action bar for assistant messages */}
          {isAIMessage && message.content && (
            <div className="mt-2 flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                onClick={handleCopy}
                className="rounded px-2 py-1 text-xs text-[var(--studio-text-secondary)] hover:bg-white/10 hover:text-[var(--studio-text-primary)]"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
              {isLast && onRegenerate && (
                <button
                  onClick={onRegenerate}
                  className="rounded px-2 py-1 text-xs text-[var(--studio-text-secondary)] hover:bg-white/10 hover:text-[var(--studio-text-primary)]"
                >
                  Regenerate
                </button>
              )}
              {message.model && (
                <span className="text-xs text-[var(--studio-text-secondary)]/50">
                  {message.model}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
