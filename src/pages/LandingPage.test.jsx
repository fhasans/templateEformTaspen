import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import LandingPage from './LandingPage';

// Mock react-icons
vi.mock('react-icons/fa', () => ({
    FaStore: () => <div data-testid="icon-store" />
}));

describe('LandingPage Component', () => {
    it('renders correctly', () => {
        render(<LandingPage onStart={() => { }} />);
        expect(screen.getByText('Selamat Datang di Portal Merchant Mantap')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Mulai Pendaftaran/i })).toBeInTheDocument();
    });

    it('calls onStart when button is clicked', () => {
        const handleStart = vi.fn();
        render(<LandingPage onStart={handleStart} />);

        const button = screen.getByRole('button', { name: /Mulai Pendaftaran/i });
        fireEvent.click(button);

        expect(handleStart).toHaveBeenCalled();
    });
});
