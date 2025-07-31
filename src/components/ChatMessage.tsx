import React from "react";

// We define a TypeScript interface for our message objects for type safety
export interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatMessageProps {
  message: Message;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const isAIMessage = message.role === "assistant";

  return (
    // The outer div changes background color for AI messages to create a striped effect
    <div className={`py-5 ${isAIMessage ? "bg-gray-800" : ""}`}>
      <div className="max-w-4xl mx-auto px-4 flex items-start gap-4">
        {/* Simple avatar icon */}
        <div className="w-8 h-8 rounded-full bg-gray-600 flex-shrink-0 flex items-center justify-center text-white font-bold text-sm">
          {isAIMessage ? "AI" : "You"}
        </div>
        {/* Message content. 'whitespace-pre-wrap' preserves line breaks */}
        <div className="flex-1 pt-1 text-white whitespace-pre-wrap">
          <p>{message.content}</p>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
