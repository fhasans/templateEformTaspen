import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom';
import EmailVerification from './EmailVerification';

// Mock react-icons
vi.mock('react-icons/fa', () => ({
    FaPaperPlane: () => <div data-testid="icon-paper-plane" />,
    FaCheckCircle: () => <div data-testid="icon-check-circle" />,
    FaLock: () => <div data-testid="icon-lock" />
}));

describe('EmailVerification Component', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        window.alert = vi.fn();
    });

    afterEach(() => {
        vi.runOnlyPendingTimers();
        vi.useRealTimers();
        vi.restoreAllMocks();
    });

    it('renders email input correctly', () => {
        render(<EmailVerification onVerified={() => { }} />);
        expect(screen.getByText('Verifikasi Email')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('nama@perusahaan.com')).toBeInTheDocument();
    });

    it('shows error for empty or invalid email', () => {
        render(<EmailVerification onVerified={() => { }} />);
        const button = screen.getByRole('button', { name: /Kirim Kode/i });

        fireEvent.click(button);
        expect(screen.getByText('Email harus diisi')).toBeInTheDocument();

        const input = screen.getByPlaceholderText('nama@perusahaan.com');
        fireEvent.change(input, { target: { value: 'invalid-email' } });
        fireEvent.click(button);
        expect(screen.getByText('Format email tidak valid')).toBeInTheDocument();
    });

    it('simulates OTP sending and verification success', async () => {
        const mockOnVerified = vi.fn();
        render(<EmailVerification onVerified={mockOnVerified} />);

        const input = screen.getByPlaceholderText('nama@perusahaan.com');
        const button = screen.getByRole('button', { name: /Kirim Kode/i });

        fireEvent.change(input, { target: { value: 'test@example.com' } });
        fireEvent.click(button);

        // Advance timer
        act(() => {
            vi.advanceTimersByTime(2000);
        });

        // Use findBy to wait for re-render
        // We look for the OTP input which replaces the email input
        const otpInput = await screen.findByPlaceholderText('123456');
        expect(otpInput).toBeInTheDocument();
        expect(window.alert).toHaveBeenCalled();

        // Extract OTP
        const alertMessage = window.alert.mock.calls[0][0];
        const otpMatch = alertMessage.match(/\d{6}/);
        const otp = otpMatch ? otpMatch[0] : '000000';

        const verifyButton = screen.getByRole('button', { name: /Verifikasi/i });

        fireEvent.change(otpInput, { target: { value: otp } });
        fireEvent.click(verifyButton);

        expect(mockOnVerified).toHaveBeenCalled();
    });
});
