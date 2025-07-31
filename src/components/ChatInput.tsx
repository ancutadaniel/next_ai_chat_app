'use client';

import React from 'react';

// This component no longer needs props or state. It's just a "dumb" UI component.
const ChatInput = () => {
  return (
    <div className="p-4">
      <div className="relative mx-auto max-w-4xl">
        <input
          type="text"
          name="message" // Name attribute is still crucial for FormData
          placeholder="Message your AI..."
          className="w-full rounded-lg bg-gray-700 p-4 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoComplete="off"
        />
        <button
          type="submit"
          className="absolute inset-y-0 right-0 flex h-full w-12 items-center justify-center text-gray-400 hover:text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
            <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 28.12 28.12 0 0 0 21.084-10.42a.75.75 0 0 0 0-.832A28.12 28.12 0 0 0 3.478 2.404Z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatInput;