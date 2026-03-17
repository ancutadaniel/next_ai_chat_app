import { describe, it, expect } from 'vitest';
import {
  AI_MODELS,
  DEFAULT_MODEL,
  getModelById,
  getModelsByProvider,
} from '@/lib/ai/models';

describe('AI Models', () => {
  it('AI_MODELS array is not empty', () => {
    expect(AI_MODELS.length).toBeGreaterThan(0);
  });

  it('DEFAULT_MODEL is the first model', () => {
    expect(DEFAULT_MODEL).toBe(AI_MODELS[0]);
  });

  it('getModelById returns correct model', () => {
    const model = getModelById('groq-llama-3.3-70b');
    expect(model.id).toBe('groq-llama-3.3-70b');
    expect(model.name).toBe('Llama 3.3 70B');
  });

  it('getModelById returns DEFAULT_MODEL for unknown id', () => {
    const model = getModelById('nonexistent-model');
    expect(model).toBe(DEFAULT_MODEL);
  });

  it('getModelsByProvider returns only models of that provider', () => {
    const groqModels = getModelsByProvider('groq');
    expect(groqModels.length).toBeGreaterThan(0);
    groqModels.forEach((model) => {
      expect(model.provider).toBe('groq');
    });
  });

  it('each model has id, name, provider, modelId fields', () => {
    AI_MODELS.forEach((model) => {
      expect(model).toHaveProperty('id');
      expect(model).toHaveProperty('name');
      expect(model).toHaveProperty('provider');
      expect(model).toHaveProperty('modelId');
      expect(typeof model.id).toBe('string');
      expect(typeof model.name).toBe('string');
      expect(typeof model.provider).toBe('string');
      expect(typeof model.modelId).toBe('string');
    });
  });
});
