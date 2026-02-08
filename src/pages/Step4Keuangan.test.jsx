import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom';
import Step4Keuangan from './Step4Keuangan';

// Mock components
vi.mock('../components/FormSection', () => ({
    default: ({ title, children }) => <div><h3>{title}</h3>{children}</div>
}));

vi.mock('../components/Input', () => ({
    default: ({ label, value, onChange, placeholder, disabled }) => (
        <div>
            <label>{label}</label>
            <input
                aria-label={label}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
            />
        </div>
    )
}));

vi.mock('../components/Select', () => ({
    default: ({ label, value, onChange, options }) => (
        <div>
            <label>{label}</label>
            <select aria-label={label} value={value} onChange={onChange}>
                {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
        </div>
    )
}));

describe('Step4Keuangan Component', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.runOnlyPendingTimers();
        vi.useRealTimers();
    });

    it('renders input fields', () => {
        render(<Step4Keuangan data={{}} updateData={() => { }} />);
        expect(screen.getByLabelText('Nomor Rekening')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Cek Rekening/i })).toBeInTheDocument();
    });

    it('validates account number', async () => {
        const updateData = vi.fn();
        render(<Step4Keuangan data={{ nomorRekening: '1234567890' }} updateData={updateData} />);

        const button = screen.getByRole('button', { name: /Cek Rekening/i });
        fireEvent.click(button);

        act(() => {
            vi.advanceTimersByTime(1500);
        });

        // 1234567890 is valid in DUMMY_ACCOUNTS
        expect(updateData).toHaveBeenCalledWith(expect.objectContaining({
            namaPemilik: 'Budi Santoso',
            tipeRekening: 'Tabungan'
        }));
    });

    it('shows error for invalid account', async () => {
        const updateData = vi.fn();
        render(<Step4Keuangan data={{ nomorRekening: '999999' }} updateData={updateData} />);

        const button = screen.getByRole('button', { name: /Cek Rekening/i });
        fireEvent.click(button);

        act(() => {
            vi.advanceTimersByTime(1500);
        });

        expect(screen.getByText(/Rekening tidak terdaftar/i)).toBeInTheDocument();
    });

    it('enforces numeric input for account number', () => {
        const updateData = vi.fn();
        // Since Input is mocked, we need to ensure onChange logic in parent is triggered.
        // In the component: onChange={(e) => { const val = e.target.value.replace(/[^0-9]/g, ''); ... }}

        render(<Step4Keuangan data={{}} updateData={updateData} />);
        const input = screen.getByLabelText('Nomor Rekening');

        fireEvent.change(input, { target: { value: '123abc456' } });
        expect(updateData).toHaveBeenCalledWith({ nomorRekening: '123456' });
    });
});
