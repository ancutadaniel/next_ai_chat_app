import { describe, it, expect } from 'vitest';
import { vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import TypingIndicator from '@/components/TypingIndicator';

vi.mock('@/components/icons/SparklesIcon', () => ({
  default: () => <span data-testid="sparkles-icon" />,
}));

describe('TypingIndicator', () => {
  it('renders three animated dots', () => {
    const { container } = render(<TypingIndicator />);

    const dots = container.querySelectorAll('.typing-dot');
    expect(dots).toHaveLength(3);
  });

  it('contains SparklesIcon', () => {
    render(<TypingIndicator />);

    expect(screen.getByTestId('sparkles-icon')).toBeInTheDocument();
  });
});
