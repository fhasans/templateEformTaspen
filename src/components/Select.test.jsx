import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import Select from './Select';

// Mock react-icons
vi.mock('react-icons/fa', () => ({
    FaChevronDown: () => <span data-testid="icon-chevron" />
}));

describe('Select Component', () => {
    const options = [
        { value: 'opt1', label: 'Option 1' },
        { value: 'opt2', label: 'Option 2' }
    ];

    it('renders label and options', () => {
        render(<Select label="Choose" options={options} />);
        expect(screen.getByText('Choose')).toBeInTheDocument();
        expect(screen.getByRole('combobox')).toBeInTheDocument();
        expect(screen.getByText('Option 1')).toBeInTheDocument();
        expect(screen.getByText('Option 2')).toBeInTheDocument();
    });

    it('displays error message', () => {
        render(<Select label="Choose" error="Selection required" options={options} />);
        expect(screen.getByText('Selection required')).toBeInTheDocument();
        expect(screen.getByRole('combobox')).toHaveClass('border-red-500');
    });

    it('handles change events', () => {
        const handleChange = vi.fn();
        render(<Select label="Choose" options={options} onChange={handleChange} />);

        const select = screen.getByRole('combobox');
        fireEvent.change(select, { target: { value: 'opt2' } });

        expect(handleChange).toHaveBeenCalled();
    });
});
