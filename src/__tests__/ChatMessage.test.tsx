import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ChatMessage from '@/components/ChatMessage';

vi.mock('@/components/MarkdownRenderer', () => ({
  default: ({ content }: { content: string }) => <div data-testid="markdown">{content}</div>,
}));

vi.mock('@/components/icons/UserIcon', () => ({
  default: () => <span data-testid="user-icon" />,
}));

vi.mock('@/components/icons/SparklesIcon', () => ({
  default: () => <span data-testid="sparkles-icon" />,
}));

describe('ChatMessage', () => {
  it('renders user message with UserIcon and plain text content', () => {
    render(
      <ChatMessage message={{ role: 'user', content: 'Hello there' }} />
    );

    expect(screen.getByTestId('user-icon')).toBeInTheDocument();
    expect(screen.getByText('Hello there')).toBeInTheDocument();
    expect(screen.queryByTestId('markdown')).not.toBeInTheDocument();
  });

  it('renders assistant message with SparklesIcon and MarkdownRenderer', () => {
    render(
      <ChatMessage message={{ role: 'assistant', content: 'Hi!' }} />
    );

    expect(screen.getByTestId('sparkles-icon')).toBeInTheDocument();
    expect(screen.getByTestId('markdown')).toBeInTheDocument();
    expect(screen.getByText('Hi!')).toBeInTheDocument();
  });

  it('shows copy button in DOM for assistant messages', () => {
    render(
      <ChatMessage message={{ role: 'assistant', content: 'Some content' }} />
    );

    expect(screen.getByText('Copy')).toBeInTheDocument();
  });

  it('copy button calls navigator.clipboard.writeText', async () => {
    render(
      <ChatMessage message={{ role: 'assistant', content: 'Copy me' }} />
    );

    fireEvent.click(screen.getByText('Copy'));

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Copy me');
  });

  it('shows regenerate button when isLast=true and onRegenerate is provided', () => {
    const onRegenerate = vi.fn();
    render(
      <ChatMessage
        message={{ role: 'assistant', content: 'Response' }}
        isLast={true}
        onRegenerate={onRegenerate}
      />
    );

    expect(screen.getByText('Regenerate')).toBeInTheDocument();
  });

  it('does NOT show regenerate button when isLast=false', () => {
    const onRegenerate = vi.fn();
    render(
      <ChatMessage
        message={{ role: 'assistant', content: 'Response' }}
        isLast={false}
        onRegenerate={onRegenerate}
      />
    );

    expect(screen.queryByText('Regenerate')).not.toBeInTheDocument();
  });

  it('shows model label when message.model is provided', () => {
    render(
      <ChatMessage
        message={{ role: 'assistant', content: 'Response', model: 'gpt-4' }}
      />
    );

    expect(screen.getByText('gpt-4')).toBeInTheDocument();
  });

  it('does NOT show action bar for user messages', () => {
    render(
      <ChatMessage message={{ role: 'user', content: 'Hello' }} />
    );

    expect(screen.queryByText('Copy')).not.toBeInTheDocument();
    expect(screen.queryByText('Regenerate')).not.toBeInTheDocument();
  });
});
