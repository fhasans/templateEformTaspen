import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import FormSection from './FormSection';

// Mock react-icons
vi.mock('react-icons/fa', () => ({
    FaChevronDown: () => <span data-testid="icon-down" />,
    FaChevronUp: () => <span data-testid="icon-up" />
}));

describe('FormSection Component', () => {
    it('renders title and children when open', () => {
        render(
            <FormSection title="Personal Info" isOpen={true}>
                <p>Child Content</p>
            </FormSection>
        );
        expect(screen.getByText('Personal Info')).toBeInTheDocument();
        expect(screen.getByText('Child Content')).toBeInTheDocument();
    });

    it('hides children when toggled closed', () => {
        render(
            <FormSection title="Personal Info" isOpen={true}>
                <p>Child Content</p>
            </FormSection>
        );

        const header = screen.getByText('Personal Info').closest('div');
        fireEvent.click(header); // Toggle Close

        expect(screen.queryByText('Child Content')).not.toBeInTheDocument();

        fireEvent.click(header); // Toggle Open
        expect(screen.getByText('Child Content')).toBeInTheDocument();
    });

    it('renders closed initially if isOpen is false', () => {
        // Warning: Component uses proper destructuring now: { isOpen: initialIsOpen = true }
        // We pass isOpen={false} to override default
        render(
            <FormSection title="Personal Info" isOpen={false}>
                <p>Child Content</p>
            </FormSection>
        );
        expect(screen.queryByText('Child Content')).not.toBeInTheDocument();
    });
});
