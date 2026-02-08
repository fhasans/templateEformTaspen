import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import Step5DataTransaksi from './Step5DataTransaksi';

// Mock components
vi.mock('../components/FormSection', () => ({
    default: ({ title, children }) => <div><h3>{title}</h3>{children}</div>
}));

vi.mock('../components/Input', () => ({
    default: ({ label, value, onChange, placeholder, type }) => (
        <div data-testid={`input-${label}`}>
            <label>{label}</label>
            <input
                aria-label={label}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                type={type}
            />
        </div>
    )
}));

describe('Step5DataTransaksi Component', () => {
    it('renders correctly', () => {
        render(<Step5DataTransaksi data={{}} updateData={() => { }} />);
        expect(screen.getByText('Data Transaksi')).toBeInTheDocument();
        expect(screen.getByLabelText('Sales Volume per Tahun')).toBeInTheDocument();
    });

    it('updates data when input changes', () => {
        const updateData = vi.fn();
        render(<Step5DataTransaksi data={{}} updateData={updateData} />);

        const input = screen.getByLabelText('Sales Volume per Tahun');
        fireEvent.change(input, { target: { value: '100000000' } });

        expect(updateData).toHaveBeenCalledWith({ salesVolumePerTahun: '100000000' });
    });
});
