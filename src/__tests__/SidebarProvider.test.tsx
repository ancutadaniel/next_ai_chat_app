import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SidebarProvider, { useSidebar } from '@/components/SidebarProvider';

function TestConsumer() {
  const { isOpen, toggle, close, open } = useSidebar();
  return (
    <div>
      <span data-testid="status">{isOpen ? 'open' : 'closed'}</span>
      <button onClick={toggle}>toggle</button>
      <button onClick={close}>close</button>
      <button onClick={open}>open</button>
    </div>
  );
}

describe('SidebarProvider', () => {
  it('provides default context values (isOpen: false)', () => {
    render(
      <SidebarProvider>
        <TestConsumer />
      </SidebarProvider>
    );
    expect(screen.getByTestId('status')).toHaveTextContent('closed');
  });

  it('toggle() flips isOpen', () => {
    render(
      <SidebarProvider>
        <TestConsumer />
      </SidebarProvider>
    );
    expect(screen.getByTestId('status')).toHaveTextContent('closed');
    fireEvent.click(screen.getByText('toggle'));
    expect(screen.getByTestId('status')).toHaveTextContent('open');
    fireEvent.click(screen.getByText('toggle'));
    expect(screen.getByTestId('status')).toHaveTextContent('closed');
  });

  it('close() sets isOpen to false', () => {
    render(
      <SidebarProvider>
        <TestConsumer />
      </SidebarProvider>
    );
    // First open it
    fireEvent.click(screen.getByText('open'));
    expect(screen.getByTestId('status')).toHaveTextContent('open');
    // Then close it
    fireEvent.click(screen.getByText('close'));
    expect(screen.getByTestId('status')).toHaveTextContent('closed');
  });

  it('open() sets isOpen to true', () => {
    render(
      <SidebarProvider>
        <TestConsumer />
      </SidebarProvider>
    );
    expect(screen.getByTestId('status')).toHaveTextContent('closed');
    fireEvent.click(screen.getByText('open'));
    expect(screen.getByTestId('status')).toHaveTextContent('open');
  });
});
