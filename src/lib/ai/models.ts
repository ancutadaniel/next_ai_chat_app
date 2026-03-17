import type { AIModel } from '@/types';

export const AI_MODELS: AIModel[] = [
  // Groq models
  {
    id: 'groq-llama-3.3-70b',
    name: 'Llama 3.3 70B',
    provider: 'groq',
    modelId: 'llama-3.3-70b-versatile',
  },
  {
    id: 'groq-llama-3.1-8b',
    name: 'Llama 3.1 8B (Fast)',
    provider: 'groq',
    modelId: 'llama-3.1-8b-instant',
  },
  // Google models
  {
    id: 'google-gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    provider: 'google',
    modelId: 'gemini-2.5-flash-preview-04-17',
  },
  // OpenRouter models (free)
  {
    id: 'openrouter-llama-3.1-8b',
    name: 'Llama 3.1 8B (OpenRouter)',
    provider: 'openrouter',
    modelId: 'meta-llama/llama-3.1-8b-instruct:free',
  },
];

export const DEFAULT_MODEL = AI_MODELS[0];

export function getModelById(id: string) {
  return AI_MODELS.find((m) => m.id === id) ?? DEFAULT_MODEL;
}

export function getModelsByProvider(provider: string) {
  return AI_MODELS.filter((m) => m.provider === provider);
}
