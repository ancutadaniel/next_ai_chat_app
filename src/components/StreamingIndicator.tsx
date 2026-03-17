'use client';

import React, { useState, useEffect } from 'react';

interface StreamingIndicatorProps {
  isStreaming: boolean;
  content: string; // current streamed content to estimate tokens
}

export default function StreamingIndicator({ isStreaming, content }: StreamingIndicatorProps) {
  const [elapsed, setElapsed] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);

  useEffect(() => {
    if (isStreaming && !startTime) {
      setStartTime(Date.now());
      setElapsed(0);
    }
    if (!isStreaming) {
      setStartTime(null);
      setElapsed(0);
    }
  }, [isStreaming, startTime]);

  useEffect(() => {
    if (!isStreaming || !startTime) return;
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [isStreaming, startTime]);

  if (!isStreaming) return null;

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  // Rough token estimate: ~4 chars per token
  const estimatedTokens = Math.max(0, Math.floor(content.length / 4));
  const formatTokens = (tokens: number) => {
    if (tokens >= 1000) return `${(tokens / 1000).toFixed(1)}k`;
    return `${tokens}`;
  };

  return (
    <div className="flex items-center justify-center gap-2 py-2 text-sm text-[var(--studio-accent)]">
      <span className="animate-pulse">✦</span>
      <span>Streaming…</span>
      <span className="text-[var(--studio-text-secondary)]">
        ({formatTime(elapsed)}{estimatedTokens > 0 ? ` · ↓ ${formatTokens(estimatedTokens)} tokens` : ''})
      </span>
    </div>
  );
}
