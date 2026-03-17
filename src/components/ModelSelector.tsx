'use client';

import React, { useState, useRef, useEffect } from 'react';
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
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const providers = [...new Set(AI_MODELS.map((m) => m.provider))];
  const selectedModel = AI_MODELS.find((m) => m.id === selectedModelId);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
        setFocusedIndex(AI_MODELS.findIndex((m) => m.id === selectedModelId));
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex((prev) => (prev + 1) % AI_MODELS.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex((prev) => (prev - 1 + AI_MODELS.length) % AI_MODELS.length);
        break;
      case 'Enter':
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < AI_MODELS.length) {
          const model = AI_MODELS[focusedIndex];
          onModelChange(model.id, model.provider, model.modelId);
          setIsOpen(false);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        break;
    }
  };

  const handleSelect = (model: typeof AI_MODELS[number]) => {
    onModelChange(model.id, model.provider, model.modelId);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative" onKeyDown={handleKeyDown}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className="flex items-center gap-2 rounded-lg border border-[var(--studio-border)] bg-[var(--studio-sidebar)] px-3 py-1.5 text-sm text-[var(--studio-text-secondary)] outline-none transition-colors hover:border-[var(--studio-accent)]/50 focus:border-[var(--studio-accent)]"
      >
        <span>{selectedModel?.name ?? 'Select model'}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        >
          <path
            fillRule="evenodd"
            d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Dropdown menu - opens UPWARD */}
      {isOpen && (
        <div
          role="listbox"
          aria-activedescendant={focusedIndex >= 0 ? `model-${AI_MODELS[focusedIndex].id}` : undefined}
          className="absolute bottom-full left-0 z-50 mb-2 w-64 overflow-hidden rounded-lg border border-[var(--studio-border)] bg-[var(--studio-sidebar)] py-1 shadow-xl"
        >
          {providers.map((provider) => (
            <div key={provider}>
              <div className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--studio-text-secondary)]/60">
                {PROVIDER_LABELS[provider] || provider}
              </div>
              {AI_MODELS.filter((m) => m.provider === provider).map((model) => {
                const modelIndex = AI_MODELS.indexOf(model);
                const isSelected = model.id === selectedModelId;
                const isFocused = modelIndex === focusedIndex;

                return (
                  <button
                    key={model.id}
                    id={`model-${model.id}`}
                    role="option"
                    aria-selected={isSelected}
                    type="button"
                    onClick={() => handleSelect(model)}
                    onMouseEnter={() => setFocusedIndex(modelIndex)}
                    className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors ${
                      isFocused ? 'bg-white/10' : ''
                    } ${isSelected ? 'text-[var(--studio-accent)]' : 'text-[var(--studio-text-primary)]'}`}
                  >
                    {isSelected && (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 flex-shrink-0">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                      </svg>
                    )}
                    {!isSelected && <span className="w-4 flex-shrink-0" />}
                    <span>{model.name}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
