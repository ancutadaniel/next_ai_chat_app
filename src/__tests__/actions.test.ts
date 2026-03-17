import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/auth', () => ({
  auth: vi.fn(),
  signIn: vi.fn(),
  signOut: vi.fn(),
}));

vi.mock('@/db', () => {
  const valuesFn = vi.fn();
  const fromFn = vi.fn(() => ({ where: vi.fn(() => []) }));
  const setFn = vi.fn(() => ({ where: vi.fn() }));
  const whereFn = vi.fn();
  return {
    db: {
      insert: vi.fn(() => ({ values: valuesFn })),
      select: vi.fn(() => ({ from: fromFn })),
      update: vi.fn(() => ({ set: setFn })),
      delete: vi.fn(() => ({ where: whereFn })),
      query: {
        conversations: { findFirst: vi.fn() },
        messages: { findMany: vi.fn(() => []) },
      },
    },
  };
});

vi.mock('@/db/schema', () => ({
  conversations: { id: 'id', userId: 'user_id', title: 'title' },
  messages: { conversationId: 'conversation_id', createdAt: 'created_at' },
}));

vi.mock('drizzle-orm', () => ({
  eq: vi.fn(),
}));

import { auth, signIn, signOut } from '@/auth';
import {
  getChatHistory,
  createNewChat,
  deleteConversation,
  updateConversationTitle,
  signInAction,
  signOutAction,
} from '@/app/actions';

describe('Server Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getChatHistory', () => {
    it('returns empty array when not authenticated', async () => {
      vi.mocked(auth).mockResolvedValue(null as never);
      const result = await getChatHistory();
      expect(result).toEqual([]);
    });

    it('queries DB when authenticated', async () => {
      vi.mocked(auth).mockResolvedValue({
        user: { id: 'user-1', name: 'Test User' },
      } as never);

      const result = await getChatHistory();
      expect(result).toEqual([]);
      expect(auth).toHaveBeenCalled();
    });
  });

  describe('createNewChat', () => {
    it('throws when not authenticated', async () => {
      vi.mocked(auth).mockResolvedValue(null as never);
      await expect(createNewChat()).rejects.toThrow('Unauthorized');
    });
  });

  describe('deleteConversation', () => {
    it('throws when not authenticated', async () => {
      vi.mocked(auth).mockResolvedValue(null as never);
      await expect(deleteConversation('conv-1')).rejects.toThrow('Unauthorized');
    });
  });

  describe('updateConversationTitle', () => {
    it('throws when not authenticated', async () => {
      vi.mocked(auth).mockResolvedValue(null as never);
      await expect(updateConversationTitle('conv-1', 'New Title')).rejects.toThrow('Unauthorized');
    });
  });

  describe('signInAction', () => {
    it('calls signIn with github', async () => {
      await signInAction();
      expect(signIn).toHaveBeenCalledWith('github', { redirectTo: '/' });
    });
  });

  describe('signOutAction', () => {
    it('calls signOut', async () => {
      await signOutAction();
      expect(signOut).toHaveBeenCalledWith({ redirectTo: '/' });
    });
  });
});
