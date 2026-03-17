import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import StreamingIndicator from '@/components/StreamingIndicator';

describe('StreamingIndicator', () => {
  it('returns null when isStreaming is false', () => {
    const { container } = render(
      <StreamingIndicator isStreaming={false} content="" />
    );

    expect(container.innerHTML).toBe('');
  });

  it('shows "Streaming…" text when isStreaming is true', () => {
    render(<StreamingIndicator isStreaming={true} content="" />);

    expect(screen.getByText('Streaming…')).toBeInTheDocument();
  });

  it('shows the sparkle character ✦', () => {
    render(<StreamingIndicator isStreaming={true} content="" />);

    expect(screen.getByText('✦')).toBeInTheDocument();
  });

  it('displays token count based on content length', () => {
    // 400 chars / 4 = 100 tokens
    const content = 'a'.repeat(400);
    render(<StreamingIndicator isStreaming={true} content={content} />);

    expect(screen.getByText(/100 tokens/)).toBeInTheDocument();
  });
});
