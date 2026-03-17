import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import HistoryItem from '@/components/HistoryItem';

vi.mock('@/app/actions', () => ({
  deleteConversation: vi.fn(),
  updateConversationTitle: vi.fn(),
}));

vi.mock('@/components/icons/TrashIcon', () => ({
  default: () => <span data-testid="trash-icon" />,
}));

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    onClick,
    onDoubleClick,
    ...rest
  }: {
    href: string;
    children: React.ReactNode;
    onClick?: () => void;
    onDoubleClick?: (e: React.MouseEvent) => void;
    [key: string]: unknown;
  }) => (
    <a href={href} onClick={onClick} onDoubleClick={onDoubleClick} {...rest}>
      {children}
    </a>
  ),
}));

const defaultChat = { id: 'chat-123', title: 'Test Chat Title' };

describe('HistoryItem', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders a link with the chat title', () => {
    render(<HistoryItem chat={defaultChat} />);
    expect(screen.getByText('Test Chat Title')).toBeInTheDocument();
  });

  it('link href points to /chat/{id}', () => {
    render(<HistoryItem chat={defaultChat} />);
    const link = screen.getByText('Test Chat Title').closest('a');
    expect(link).toHaveAttribute('href', '/chat/chat-123');
  });

  it('shows delete button in DOM (visible on hover)', () => {
    render(<HistoryItem chat={defaultChat} />);
    expect(screen.getByTestId('trash-icon')).toBeInTheDocument();
  });

  it('clicking delete button opens confirmation modal', () => {
    render(<HistoryItem chat={defaultChat} />);
    const deleteButton = screen.getByTitle('Delete');
    fireEvent.click(deleteButton);
    expect(screen.getByText('Delete chat?')).toBeInTheDocument();
  });

  it('modal shows "Delete chat?" heading', () => {
    render(<HistoryItem chat={defaultChat} />);
    fireEvent.click(screen.getByTitle('Delete'));
    const heading = screen.getByText('Delete chat?');
    expect(heading.tagName).toBe('H2');
  });

  it('modal shows the chat title in confirmation text', () => {
    render(<HistoryItem chat={defaultChat} />);
    fireEvent.click(screen.getByTitle('Delete'));
    expect(
      screen.getByText('This will delete "Test Chat Title" permanently.')
    ).toBeInTheDocument();
  });

  it('cancel button closes the modal', () => {
    render(<HistoryItem chat={defaultChat} />);
    fireEvent.click(screen.getByTitle('Delete'));
    expect(screen.getByText('Delete chat?')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Cancel'));
    expect(screen.queryByText('Delete chat?')).not.toBeInTheDocument();
  });

  it('calls onNavigate when link is clicked', () => {
    const onNavigate = vi.fn();
    render(<HistoryItem chat={defaultChat} onNavigate={onNavigate} />);
    fireEvent.click(screen.getByText('Test Chat Title'));
    expect(onNavigate).toHaveBeenCalledOnce();
  });

  it('double-clicking the title enables editing mode', () => {
    render(<HistoryItem chat={defaultChat} />);
    const link = screen.getByText('Test Chat Title');
    fireEvent.doubleClick(link);
    expect(screen.getByDisplayValue('Test Chat Title')).toBeInTheDocument();
  });

  it('edit mode shows an input with the current title', () => {
    render(<HistoryItem chat={defaultChat} />);
    fireEvent.doubleClick(screen.getByText('Test Chat Title'));
    const input = screen.getByDisplayValue('Test Chat Title');
    expect(input.tagName).toBe('INPUT');
    expect(input).toHaveAttribute('type', 'text');
  });
});
