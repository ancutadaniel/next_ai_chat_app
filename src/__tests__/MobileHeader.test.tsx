import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MobileHeader from '@/components/MobileHeader';

const mockToggle = vi.fn();
vi.mock('@/components/SidebarProvider', () => ({
  useSidebar: () => ({
    toggle: mockToggle,
    isOpen: false,
    close: vi.fn(),
    open: vi.fn(),
  }),
}));

describe('MobileHeader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the "W3B AI Chat" text', () => {
    render(<MobileHeader />);
    expect(screen.getByText('W3B AI Chat')).toBeInTheDocument();
  });

  it('has a hamburger button', () => {
    render(<MobileHeader />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('clicking the button calls toggle from useSidebar', () => {
    render(<MobileHeader />);
    fireEvent.click(screen.getByRole('button'));
    expect(mockToggle).toHaveBeenCalledOnce();
  });
});
