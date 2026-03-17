import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('@/auth', () => ({
  auth: vi.fn(),
}));

vi.mock('@/app/actions', () => ({
  createNewChat: vi.fn(),
}));

import { auth } from '@/auth';
import Home from '@/app/page';

describe('Home Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('when not authenticated', () => {
    beforeEach(() => {
      vi.mocked(auth).mockResolvedValue(null as never);
    });

    it('renders "W3B AI Chat" heading', async () => {
      const Component = await Home();
      render(Component);
      expect(screen.getByText('W3B AI Chat')).toBeInTheDocument();
    });

    it('renders sign-in prompt', async () => {
      const Component = await Home();
      render(Component);
      expect(
        screen.getByText('Sign in with GitHub to get started.')
      ).toBeInTheDocument();
    });

    it('renders feature cards', async () => {
      const Component = await Home();
      render(Component);
      expect(screen.getByText('Streaming Responses')).toBeInTheDocument();
      expect(screen.getByText('Multi-Provider')).toBeInTheDocument();
      expect(screen.getByText('Markdown Support')).toBeInTheDocument();
      expect(screen.getByText('System Prompts')).toBeInTheDocument();
    });
  });

  describe('when authenticated', () => {
    beforeEach(() => {
      vi.mocked(auth).mockResolvedValue({
        user: { id: 'user-1', name: 'John Doe' },
      } as never);
    });

    it('renders welcome message with user name', async () => {
      const Component = await Home();
      render(Component);
      expect(screen.getByText('Welcome back, John!')).toBeInTheDocument();
    });

    it('renders example prompt cards', async () => {
      const Component = await Home();
      render(Component);
      expect(
        screen.getByText('Explain quantum computing in simple terms')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Write a Python function to merge two sorted lists')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Help me draft a professional email')
      ).toBeInTheDocument();
    });
  });
});
