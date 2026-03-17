import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SystemPromptEditor from '@/components/SystemPromptEditor';

describe('SystemPromptEditor', () => {
  const defaultProps = {
    systemPrompt: 'You are a helpful assistant.',
    onSystemPromptChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders a settings button (gear icon)', () => {
    render(<SystemPromptEditor {...defaultProps} />);
    const button = screen.getByTitle('System prompt');
    expect(button).toBeInTheDocument();
  });

  it('clicking the button opens the editor panel', () => {
    render(<SystemPromptEditor {...defaultProps} />);
    fireEvent.click(screen.getByTitle('System prompt'));
    expect(screen.getByText('System Prompt')).toBeInTheDocument();
  });

  it('shows "System Prompt" label when open', () => {
    render(<SystemPromptEditor {...defaultProps} />);
    fireEvent.click(screen.getByTitle('System prompt'));
    const label = screen.getByText('System Prompt');
    expect(label.tagName).toBe('LABEL');
  });

  it('shows textarea with current systemPrompt value', () => {
    render(<SystemPromptEditor {...defaultProps} />);
    fireEvent.click(screen.getByTitle('System prompt'));
    const textarea = screen.getByDisplayValue('You are a helpful assistant.');
    expect(textarea.tagName).toBe('TEXTAREA');
  });

  it('calls onSystemPromptChange when textarea value changes', () => {
    render(<SystemPromptEditor {...defaultProps} />);
    fireEvent.click(screen.getByTitle('System prompt'));
    const textarea = screen.getByDisplayValue('You are a helpful assistant.');
    fireEvent.change(textarea, { target: { value: 'New prompt' } });
    expect(defaultProps.onSystemPromptChange).toHaveBeenCalledWith('New prompt');
  });

  it('close button closes the panel', () => {
    render(<SystemPromptEditor {...defaultProps} />);
    fireEvent.click(screen.getByTitle('System prompt'));
    expect(screen.getByText('System Prompt')).toBeInTheDocument();
    // The close button is the second button inside the opened panel
    const buttons = screen.getAllByRole('button');
    // Find the close button (it's inside the panel, not the gear button)
    const closeButton = buttons.find(
      (btn) => btn !== screen.getByTitle('System prompt')
    )!;
    fireEvent.click(closeButton);
    expect(screen.queryByText('System Prompt')).not.toBeInTheDocument();
  });

  it('shows helper text about instructions', () => {
    render(<SystemPromptEditor {...defaultProps} />);
    fireEvent.click(screen.getByTitle('System prompt'));
    expect(
      screen.getByText(
        "Instructions that guide the AI's behavior for this conversation."
      )
    ).toBeInTheDocument();
  });
});
