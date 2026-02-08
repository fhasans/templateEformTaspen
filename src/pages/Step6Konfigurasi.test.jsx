import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import Step6Konfigurasi from './Step6Konfigurasi';

// Mock components
vi.mock('../components/FormSection', () => ({
    default: ({ title, children }) => <div><h3>{title}</h3>{children}</div>
}));

vi.mock('../components/Input', () => ({
    default: ({ label, value, onChange, placeholder, type, disabled }) => (
        <div data-testid={`input-${label}`}>
            <label>{label}</label>
            <input
                aria-label={label}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                type={type}
                disabled={disabled}
            />
        </div>
    )
}));

vi.mock('../components/Select', () => ({
    default: ({ label, value, onChange, options }) => (
        <div data-testid={`select-${label}`}>
            <label>{label}</label>
            <select aria-label={label} value={value} onChange={onChange}>
                {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
        </div>
    )
}));

describe('Step6Konfigurasi Component', () => {
    it('initializes default values on mount', () => {
        const updateData = vi.fn();
        render(<Step6Konfigurasi data={{}} updateData={updateData} />);

        expect(updateData).toHaveBeenCalledWith(expect.objectContaining({
            kodeCabangAkusisi: '1201',
            kategoriUsaha: 'UME'
        }));
    });

    it('renders basic configuration fields', () => {
        render(<Step6Konfigurasi data={{}} updateData={() => { }} />);
        expect(screen.getByText('Konfigurasi Teknis')).toBeInTheDocument();
        expect(screen.getByLabelText('Kode Cabang Akuisisi (Konsol)')).toBeInTheDocument();
        expect(screen.getByLabelText('Jadwal Settlement')).toBeInTheDocument();
    });

    it('does NOT render EDC fields for QRIS Statis', () => {
        const dataPemilik = { tipeLayananQRIS: 'statis' };
        render(<Step6Konfigurasi data={{}} updateData={() => { }} dataPemilik={dataPemilik} />);

        expect(screen.queryByLabelText('Jumlah Mesin EDC')).not.toBeInTheDocument();
    });

    it('renders EDC fields for QRIS Dinamis', () => {
        const dataPemilik = { tipeLayananQRIS: 'dinamis' };
        render(<Step6Konfigurasi data={{}} updateData={() => { }} dataPemilik={dataPemilik} />);

        expect(screen.getByLabelText('Jumlah Mesin EDC')).toBeInTheDocument();
        expect(screen.getByLabelText('Biaya Administrasi EDC (per bulan)')).toBeInTheDocument();
    });

    it('updates data when inputs change', () => {
        const updateData = vi.fn();
        render(<Step6Konfigurasi data={{}} updateData={updateData} />);

        const input = screen.getByLabelText('Jadwal Settlement');
        fireEvent.change(input, { target: { value: 'H+2' } });

        expect(updateData).toHaveBeenCalledWith({ jadwalSettlement: 'H+2' });
    });
});
