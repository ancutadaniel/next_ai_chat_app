// In: src/components/ChatMessage.tsx
import React from 'react';
import type { Message } from '@/types'; // Import from our new types file
import UserIcon from './icons/UserIcon';
import SparklesIcon from './icons/SparklesIcon';

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isAIMessage = message.role === 'assistant';

  return (
    <div className="py-6">
      <div className="mx-auto flex max-w-4xl gap-4 px-4">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[var(--studio-sidebar)] p-1">
          {isAIMessage ? <SparklesIcon /> : <UserIcon />}
        </div>
        <div className="prose prose-invert max-w-none flex-1 whitespace-pre-wrap pt-1">
          {message.content}
        </div>
      </div>
    </div>
  );
}