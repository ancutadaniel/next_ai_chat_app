'use client';

import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useRouter } from 'next/navigation';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import TypingIndicator from './TypingIndicator';
import StreamingIndicator from './StreamingIndicator';
import ModelSelector from './ModelSelector';
import SystemPromptEditor from './SystemPromptEditor';
import { DEFAULT_MODEL } from '@/lib/ai/models';
import { toast } from 'sonner';

interface ChatProps {
  initialMessages: {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    model?: string | null;
  }[];
  conversationId: string;
  initialModel?: string;
  initialProvider?: string;
  initialSystemPrompt?: string | null;
  initialPrompt?: string;
}

export default function Chat({
  initialMessages,
  conversationId,
  initialModel,
  initialProvider,
  initialSystemPrompt,
  initialPrompt,
}: ChatProps) {
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [hasScrolledUp, setHasScrolledUp] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState(initialPrompt || '');

  const [selectedModel, setSelectedModel] = useState({
    id: DEFAULT_MODEL.id,
    provider: initialProvider || DEFAULT_MODEL.provider,
    modelId: initialModel || DEFAULT_MODEL.modelId,
  });
  const [systemPrompt, setSystemPrompt] = useState(
    initialSystemPrompt || ''
  );

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: '/api/chat',
        body: {
          conversationId,
          model: selectedModel.modelId,
          provider: selectedModel.provider,
          systemPrompt: systemPrompt || undefined,
        },
      }),
    [conversationId, selectedModel.modelId, selectedModel.provider, systemPrompt]
  );

  const {
    messages,
    sendMessage,
    status,
    error,
    stop,
    regenerate,
  } = useChat({
    transport,
    messages: initialMessages.map((m) => ({
      id: m.id,
      role: m.role,
      parts: [{ type: 'text' as const, text: m.content }],
    })),
    onFinish: () => {
      router.refresh();
    },
    onError: (err) => {
      if (err.message.includes('429')) {
        toast.error('Rate limited. Please wait a moment and try again.');
      } else if (err.message.includes('401')) {
        toast.error('Authentication error. Please sign in again.');
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    },
  });

  const isLoading = status === 'submitted' || status === 'streaming';

  // Auto-scroll logic
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setHasScrolledUp(!isNearBottom);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!hasScrolledUp) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, hasScrolledUp]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input });
    setInput('');
  };

  // Extract text content from message parts
  const getMessageContent = (msg: typeof messages[number]): string => {
    return msg.parts
      .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
      .map((p) => p.text)
      .join('');
  };

  return (
    <div className="flex h-full flex-col">
      {/* Top bar with model selector */}
      <div className="flex items-center gap-3 border-b border-[var(--studio-border)] px-6 py-3">
        <ModelSelector
          selectedModelId={selectedModel.id}
          onModelChange={(id, provider, modelId) =>
            setSelectedModel({ id, provider, modelId })
          }
        />
        <SystemPromptEditor
          systemPrompt={systemPrompt}
          onSystemPromptChange={setSystemPrompt}
        />
      </div>

      {/* Messages */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
        {messages.length === 0 && (
          <div className="flex h-full items-center justify-center">
            <p className="text-[var(--studio-text-secondary)]">
              Send a message to start the conversation.
            </p>
          </div>
        )}
        {messages.map((msg, index) => (
          <ChatMessage
            key={msg.id}
            message={{
              role: msg.role,
              content: getMessageContent(msg),
            }}
            isLast={index === messages.length - 1}
            onRegenerate={
              index === messages.length - 1 && msg.role === 'assistant'
                ? () => regenerate()
                : undefined
            }
          />
        ))}
        {status === 'submitted' && <TypingIndicator />}
        {status === 'streaming' && (
          <StreamingIndicator
            isStreaming={true}
            content={getMessageContent(messages[messages.length - 1] ?? { parts: [] })}
          />
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Error display */}
      {error && (
        <div className="mx-auto flex max-w-4xl items-center gap-2 px-4 py-2 text-sm text-red-400">
          <span>Failed to send message.</span>
          <button
            onClick={() => regenerate()}
            className="underline hover:text-red-300"
          >
            Retry
          </button>
        </div>
      )}

      {/* Input area */}
      <div className="w-full p-4">
        <ChatInput
          input={input}
          onInputChange={setInput}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          onStop={stop}
        />
      </div>
    </div>
  );
}
