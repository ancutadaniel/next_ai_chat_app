import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/auth', () => ({
  auth: vi.fn(),
}));

vi.mock('@/db', () => ({
  db: {
    insert: vi.fn(() => ({ values: vi.fn() })),
    update: vi.fn(() => ({ set: vi.fn(() => ({ where: vi.fn() })) })),
    query: {
      conversations: { findFirst: vi.fn() },
    },
  },
}));

vi.mock('@/db/schema', () => ({
  conversations: {},
  messages: {},
}));

vi.mock('@/lib/ai/providers', () => ({
  getModel: vi.fn(() => 'mock-model'),
}));

vi.mock('ai', () => ({
  streamText: vi.fn(() => ({
    toUIMessageStreamResponse: vi.fn(
      () => new Response('stream', { status: 200 })
    ),
  })),
  UIMessage: {},
  convertToModelMessages: vi.fn(() => []),
}));

vi.mock('drizzle-orm', () => ({
  eq: vi.fn(),
}));

import { auth } from '@/auth';
import { db } from '@/db';
import { POST } from '@/app/api/chat/route';

function makeRequest(body: Record<string, unknown>): Request {
  return new Request('http://localhost/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('POST /api/chat', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 when not authenticated', async () => {
    vi.mocked(auth).mockResolvedValue(null as never);

    const response = await POST(
      makeRequest({ messages: [], conversationId: 'conv-1' })
    );

    expect(response.status).toBe(401);
    expect(await response.text()).toBe('Unauthorized');
  });

  it('returns 400 when conversationId is missing', async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: 'user-1' },
    } as never);

    const response = await POST(makeRequest({ messages: [] }));

    expect(response.status).toBe(400);
    expect(await response.text()).toBe('Missing conversationId');
  });

  it('returns 403 when user does not own the conversation', async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: 'user-1' },
    } as never);

    vi.mocked(db.query.conversations.findFirst).mockResolvedValue({
      id: 'conv-1',
      userId: 'other-user',
      title: 'Test',
    } as never);

    const response = await POST(
      makeRequest({ messages: [], conversationId: 'conv-1' })
    );

    expect(response.status).toBe(403);
    expect(await response.text()).toBe('Forbidden');
  });

  it('returns 200 with stream response for valid request', async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: 'user-1' },
    } as never);

    vi.mocked(db.query.conversations.findFirst).mockResolvedValue({
      id: 'conv-1',
      userId: 'user-1',
      title: 'Test Chat',
    } as never);

    const response = await POST(
      makeRequest({
        messages: [
          {
            id: 'msg-1',
            role: 'user',
            parts: [{ type: 'text', text: 'Hello' }],
          },
        ],
        conversationId: 'conv-1',
      })
    );

    expect(response.status).toBe(200);
  });
});
