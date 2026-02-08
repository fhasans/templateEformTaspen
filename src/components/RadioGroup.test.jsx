import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import RadioGroup from './RadioGroup';

describe('RadioGroup Component', () => {
    const options = [
        { value: 'a', label: 'Option A' },
        { value: 'b', label: 'Option B' }
    ];

    it('renders label and options', () => {
        render(<RadioGroup label="Select One" name="test-radio" options={options} />);
        expect(screen.getByText('Select One')).toBeInTheDocument();
        expect(screen.getByLabelText('Option A')).toBeInTheDocument();
        expect(screen.getByLabelText('Option B')).toBeInTheDocument();
    });

    it('calls onChange with selected value', () => {
        const handleChange = vi.fn();
        render(<RadioGroup label="Select One" name="test-radio" options={options} onChange={handleChange} />);

        const radioB = screen.getByLabelText('Option B');
        fireEvent.click(radioB);

        expect(handleChange).toHaveBeenCalledWith('b');
    });

    it('shows required asterisk', () => {
        render(<RadioGroup label="Select One" required name="test-radio" options={options} />);
        expect(screen.getByText('*')).toHaveClass('text-red-600');
    });
});
