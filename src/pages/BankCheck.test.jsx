import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom';
import BankCheck from './BankCheck';

// Mock react-icons
vi.mock('react-icons/fa', () => ({
    FaCreditCard: () => <div data-testid="icon-credit-card" />,
    FaSearch: () => <div data-testid="icon-search" />,
    FaExclamationTriangle: () => <div data-testid="icon-warning" />,
    FaCheckCircle: () => <div data-testid="icon-check" />
}));

describe('BankCheck Component', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.runOnlyPendingTimers();
        vi.useRealTimers();
    });

    it('renders correctly', () => {
        render(<BankCheck onVerified={() => { }} />);
        expect(screen.getByRole('heading', { name: /Cek Rekening/i })).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Contoh: 1234567890')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Cek Rekening/i })).toBeInTheDocument();
    });

    it('shows error for invalid account', async () => {
        render(<BankCheck onVerified={() => { }} />);

        const input = screen.getByPlaceholderText('Contoh: 1234567890');
        // Button text changes to 'Memeriksa...' when clicked, so we find by role initially
        const button = screen.getByRole('button', { name: /Cek Rekening/i });

        fireEvent.change(input, { target: { value: '999999' } });
        fireEvent.click(button);

        // Fast-forward 1s (API simulation)
        act(() => {
            vi.advanceTimersByTime(1000);
        });

        await waitFor(() => {
            expect(screen.getByText(/Rekening Tidak Terdaftar/i)).toBeInTheDocument();
        });
    });

    it('calls onVerified for valid account after progress bar', async () => {
        const mockOnVerified = vi.fn();
        render(<BankCheck onVerified={mockOnVerified} />);

        const input = screen.getByPlaceholderText('Contoh: 1234567890');
        const button = screen.getByRole('button', { name: /Cek Rekening/i });

        fireEvent.change(input, { target: { value: '1234567890' } });
        fireEvent.click(button);

        // Fast-forward initial check (1s)
        act(() => {
            vi.advanceTimersByTime(1000);
        });

        // Expect success message
        await waitFor(() => {
            expect(screen.getByText(/Rekening Terdaftar/i)).toBeInTheDocument();
        });

        // Fast-forward progress bar (5s)
        act(() => {
            vi.advanceTimersByTime(5000);
        });

        await waitFor(() => {
            expect(mockOnVerified).toHaveBeenCalledWith('1234567890');
        });
    });
});
