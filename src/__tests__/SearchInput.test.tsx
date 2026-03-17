import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchInput from '@/components/SearchInput';

describe('SearchInput', () => {
  it('renders input with "Search chats..." placeholder', () => {
    render(<SearchInput value="" onChange={vi.fn()} />);

    expect(screen.getByPlaceholderText('Search chats...')).toBeInTheDocument();
  });

  it('calls onChange when typing', () => {
    const onChange = vi.fn();
    render(<SearchInput value="" onChange={onChange} />);

    fireEvent.change(screen.getByPlaceholderText('Search chats...'), {
      target: { value: 'hello' },
    });

    expect(onChange).toHaveBeenCalledWith('hello');
  });

  it('shows the current value', () => {
    render(<SearchInput value="current search" onChange={vi.fn()} />);

    expect(screen.getByPlaceholderText('Search chats...')).toHaveValue('current search');
  });
});
