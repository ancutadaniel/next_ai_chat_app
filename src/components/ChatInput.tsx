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
          name="message" // Name attribute is still crucial for FormData
          placeholder="Message your AI..."
          className="w-full rounded-lg bg-gray-600 p-4 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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