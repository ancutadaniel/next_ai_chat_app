import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import ChatInput from '@/components/ChatInput';

vi.mock('react-textarea-autosize', () => ({
  default: (props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { minRows?: number; maxRows?: number }) => {
    const { minRows, maxRows, ...rest } = props;
    return <textarea {...rest} />;
  },
}));

vi.mock('@/components/icons/ArrowUpIcon', () => ({
  default: () => <span data-testid="arrow-up-icon" />,
}));

const defaultProps = {
  input: '',
  onInputChange: vi.fn(),
  onSubmit: vi.fn(),
  isLoading: false,
  onStop: vi.fn(),
};

describe('ChatInput', () => {
  it('renders textarea with placeholder "Enter a prompt here..."', () => {
    render(<ChatInput {...defaultProps} />);

    expect(screen.getByPlaceholderText('Enter a prompt here...')).toBeInTheDocument();
  });

  it('submit button is disabled when input is empty', () => {
    const { container } = render(<ChatInput {...defaultProps} input="" />);

    const submitButton = container.querySelector('button[type="submit"]')!;
    expect(submitButton).toBeDisabled();
  });

  it('submit button is disabled when isLoading is true', () => {
    const { container } = render(<ChatInput {...defaultProps} input="some text" isLoading={true} />);

    const submitButton = container.querySelector('button[type="submit"]')!;
    expect(submitButton).toBeDisabled();
  });

  it('textarea is disabled when isLoading is true', () => {
    render(<ChatInput {...defaultProps} isLoading={true} />);

    expect(screen.getByPlaceholderText('Enter a prompt here...')).toBeDisabled();
  });

  it('calls onSubmit when form is submitted with non-empty input', () => {
    const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
    render(<ChatInput {...defaultProps} input="Hello" onSubmit={onSubmit} />);

    const form = screen.getByPlaceholderText('Enter a prompt here...').closest('form')!;
    fireEvent.submit(form);

    expect(onSubmit).toHaveBeenCalled();
  });

  it('shows "Stop generating" button when isLoading is true', () => {
    render(<ChatInput {...defaultProps} isLoading={true} />);

    expect(screen.getByText('Stop generating')).toBeInTheDocument();
  });

  it('calls onStop when stop button is clicked', () => {
    const onStop = vi.fn();
    render(<ChatInput {...defaultProps} isLoading={true} onStop={onStop} />);

    fireEvent.click(screen.getByText('Stop generating'));

    expect(onStop).toHaveBeenCalled();
  });

  it('calls onInputChange when typing in textarea', () => {
    const onInputChange = vi.fn();
    render(<ChatInput {...defaultProps} onInputChange={onInputChange} />);

    fireEvent.change(screen.getByPlaceholderText('Enter a prompt here...'), {
      target: { value: 'test' },
    });

    expect(onInputChange).toHaveBeenCalledWith('test');
  });
});
