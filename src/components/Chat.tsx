'use client';

import React, { useOptimistic, useRef, useEffect } from 'react';
import { sendMessageAction } from '@/app/actions';
import type { Message } from '@/types';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

interface ChatProps {
  initialMessages: Message[];
  conversationId: string;
}

export default function Chat({ initialMessages, conversationId }: ChatProps) {
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    initialMessages,
    (state, newMessage: Message) => [...state, newMessage]
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [optimisticMessages]);

  const formAction = async (formData: FormData) => {
    formData.append('conversationId', conversationId);

    const messageContent = formData.get('message') as string;
    if (!messageContent.trim()) return;

    addOptimisticMessage({ role: 'user', content: messageContent });
    await sendMessageAction(formData);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto">
        {optimisticMessages.map((msg, index) => (
          <ChatMessage key={index} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="w-full p-4">
        <form action={formAction}>
          <ChatInput />
        </form>
      </div>
    </div>
  );
}