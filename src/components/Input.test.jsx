import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import Input from './Input';

describe('Input Component', () => {
    it('renders label and input', () => {
        render(<Input label="Username" />);
        expect(screen.getByText('Username')).toBeInTheDocument();
        expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('displays error message', () => {
        render(<Input label="Username" error="Invalid input" />);
        expect(screen.getByText('Invalid input')).toBeInTheDocument();
        expect(screen.getByRole('textbox')).toHaveClass('border-red-500');
    });

    it('handles change events', () => {
        const handleChange = vi.fn();
        render(<Input label="Username" onChange={handleChange} />);

        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'test' } });

        expect(handleChange).toHaveBeenCalled();
    });

    it('renders as disabled', () => {
        render(<Input label="Username" disabled />);
        expect(screen.getByRole('textbox')).toBeDisabled();
        expect(screen.getByRole('textbox')).toHaveClass('bg-gray-200');
    });
});
