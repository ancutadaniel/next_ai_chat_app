'use client'; // This must be a client component to use hooks

import React, { useOptimistic, useRef, useEffect } from 'react';
import { sendMessageAction } from '@/app/actions';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { Message } from '@/types';

interface ChatProps {
  initialMessages: Message[];
}

const Chat = ({ initialMessages }: ChatProps) => {
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    initialMessages,
    (state, newMessage: Message) => [...state, newMessage]
  );
  const formRef = useRef<HTMLFormElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Effect to scroll to the bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [optimisticMessages]);

  const formAction = async (formData: FormData) => {
    const messageContent = formData.get('message') as string;
    // Add the user's message to the UI optimistically
    addOptimisticMessage({ role: 'user', content: messageContent });
    // Clear the form input
    formRef.current?.reset();
    // Call the server action
    await sendMessageAction(formData);
  };

  return (
    <div className="flex h-full flex-col">
      {/* Message Display Area */}
      <div className="flex-1 overflow-y-auto">
        {optimisticMessages.map((msg, index) => (
          <ChatMessage key={index} message={msg} />
        ))}
        {/* Empty div to act as a scroll target */}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input Area */}
      <div className="border-t border-gray-700">
        {/* We pass our client-side `formAction` wrapper to the form */}
        <form action={formAction} ref={formRef} >
          <ChatInput />
        </form>
      </div>
    </div>
  );
};

export default Chat;