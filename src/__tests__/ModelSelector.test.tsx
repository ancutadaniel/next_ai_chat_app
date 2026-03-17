import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ModelSelector from '@/components/ModelSelector';
import { AI_MODELS } from '@/lib/ai/models';

describe('ModelSelector', () => {
  const defaultProps = {
    selectedModelId: AI_MODELS[0].id,
    onModelChange: vi.fn(),
  };

  it('renders a trigger button with selected model name', () => {
    render(<ModelSelector {...defaultProps} />);

    expect(screen.getByRole('button', { name: new RegExp(AI_MODELS[0].name) })).toBeInTheDocument();
  });

  it('opens dropdown when clicked and shows all models', () => {
    render(<ModelSelector {...defaultProps} />);

    fireEvent.click(screen.getByRole('button', { name: new RegExp(AI_MODELS[0].name) }));

    for (const model of AI_MODELS) {
      expect(screen.getByRole('option', { name: model.name })).toBeInTheDocument();
    }
  });

  it('calls onModelChange when an option is clicked', () => {
    const onModelChange = vi.fn();
    render(<ModelSelector {...defaultProps} onModelChange={onModelChange} />);

    fireEvent.click(screen.getByRole('button', { name: new RegExp(AI_MODELS[0].name) }));

    const targetModel = AI_MODELS[1];
    fireEvent.click(screen.getByRole('option', { name: targetModel.name }));

    expect(onModelChange).toHaveBeenCalledWith(
      targetModel.id,
      targetModel.provider,
      targetModel.modelId
    );
  });

  it('closes dropdown after selection', () => {
    render(<ModelSelector {...defaultProps} />);

    fireEvent.click(screen.getByRole('button', { name: new RegExp(AI_MODELS[0].name) }));
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('option', { name: AI_MODELS[1].name }));
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('shows checkmark for selected model', () => {
    render(<ModelSelector {...defaultProps} />);

    fireEvent.click(screen.getByRole('button', { name: new RegExp(AI_MODELS[0].name) }));

    const selectedOption = screen.getByRole('option', { name: AI_MODELS[0].name });
    expect(selectedOption).toHaveAttribute('aria-selected', 'true');
  });
});
