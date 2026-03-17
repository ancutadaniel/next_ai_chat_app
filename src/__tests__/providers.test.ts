import { describe, it, expect, vi } from 'vitest';

vi.mock('@ai-sdk/groq', () => ({
  createGroq: vi.fn(() => vi.fn(() => 'groq-model')),
}));
vi.mock('@ai-sdk/google', () => ({
  createGoogleGenerativeAI: vi.fn(() => vi.fn(() => 'google-model')),
}));
vi.mock('@ai-sdk/openai', () => ({
  createOpenAI: vi.fn(() => vi.fn(() => 'openai-model')),
}));

import { getProvider, getModel } from '@/lib/ai/providers';
import { createGroq } from '@ai-sdk/groq';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';

describe('AI Providers', () => {
  it('getProvider returns a provider for groq', () => {
    const provider = getProvider('groq');
    expect(provider).toBeDefined();
    expect(createGroq).toHaveBeenCalled();
  });

  it('getProvider returns a provider for google', () => {
    const provider = getProvider('google');
    expect(provider).toBeDefined();
    expect(createGoogleGenerativeAI).toHaveBeenCalled();
  });

  it('getProvider returns a provider for openrouter', () => {
    const provider = getProvider('openrouter');
    expect(provider).toBeDefined();
    expect(createOpenAI).toHaveBeenCalled();
  });

  it('getProvider defaults to groq for unknown provider', () => {
    vi.mocked(createGroq).mockClear();
    const provider = getProvider('unknown-provider');
    expect(provider).toBeDefined();
    expect(createGroq).toHaveBeenCalled();
  });

  it('getModel returns a model instance', () => {
    const model = getModel('groq', 'llama-3.3-70b-versatile');
    expect(model).toBe('groq-model');
  });
});
