import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ModelSelector from '@/components/ModelSelector';
import { AI_MODELS } from '@/lib/ai/models';

describe('ModelSelector', () => {
  const defaultProps = {
    selectedModelId: AI_MODELS[0].id,
    onModelChange: vi.fn(),
  };

  it('renders a select element', () => {
    render(<ModelSelector {...defaultProps} />);

    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('shows all models from AI_MODELS grouped by provider', () => {
    render(<ModelSelector {...defaultProps} />);

    for (const model of AI_MODELS) {
      expect(screen.getByText(model.name)).toBeInTheDocument();
    }

    // Check optgroups exist
    const select = screen.getByRole('combobox');
    const optgroups = select.querySelectorAll('optgroup');
    const providers = [...new Set(AI_MODELS.map((m) => m.provider))];
    expect(optgroups).toHaveLength(providers.length);
  });

  it('calls onModelChange with correct model data when selection changes', () => {
    const onModelChange = vi.fn();
    render(<ModelSelector {...defaultProps} onModelChange={onModelChange} />);

    const targetModel = AI_MODELS[1];
    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: targetModel.id },
    });

    expect(onModelChange).toHaveBeenCalledWith(
      targetModel.id,
      targetModel.provider,
      targetModel.modelId
    );
  });

  it('has the correct initial selected value', () => {
    const selectedModel = AI_MODELS[2];
    render(
      <ModelSelector
        selectedModelId={selectedModel.id}
        onModelChange={vi.fn()}
      />
    );

    expect(screen.getByRole('combobox')).toHaveValue(selectedModel.id);
  });
});
