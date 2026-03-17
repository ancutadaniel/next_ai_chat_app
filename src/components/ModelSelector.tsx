'use client';

import React from 'react';
import { AI_MODELS } from '@/lib/ai/models';

interface ModelSelectorProps {
  selectedModelId: string;
  onModelChange: (modelId: string, provider: string, modelApiId: string) => void;
}

const PROVIDER_LABELS: Record<string, string> = {
  groq: 'Groq',
  google: 'Google',
  openrouter: 'OpenRouter',
};

export default function ModelSelector({ selectedModelId, onModelChange }: ModelSelectorProps) {
  const providers = [...new Set(AI_MODELS.map((m) => m.provider))];

  return (
    <select
      value={selectedModelId}
      onChange={(e) => {
        const model = AI_MODELS.find((m) => m.id === e.target.value);
        if (model) {
          onModelChange(model.id, model.provider, model.modelId);
        }
      }}
      className="rounded-lg border border-[var(--studio-border)] bg-[var(--studio-sidebar)] px-3 py-1.5 text-sm text-[var(--studio-text-secondary)] outline-none transition-colors hover:border-[var(--studio-accent)]/50 focus:border-[var(--studio-accent)]"
    >
      {providers.map((provider) => (
        <optgroup key={provider} label={PROVIDER_LABELS[provider] || provider}>
          {AI_MODELS.filter((m) => m.provider === provider).map((model) => (
            <option key={model.id} value={model.id}>
              {model.name}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );
}
