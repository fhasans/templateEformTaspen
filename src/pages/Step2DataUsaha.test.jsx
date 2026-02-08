import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import Step2DataUsaha from './Step2DataUsaha';

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
                type={type || 'text'}
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

describe('Step2DataUsaha Component', () => {
    it('initializes default values on mount', () => {
        const updateData = vi.fn();
        render(<Step2DataUsaha data={{}} updateData={updateData} />);

        expect(updateData).toHaveBeenCalledWith(expect.objectContaining({
            jenisUsaha: 'rumah_makan',
            provinsiUsaha: 'dki_jakarta',
            bentukUsaha: 'perorangan'
        }));
    });

    it('renders form sections', () => {
        render(<Step2DataUsaha data={{}} updateData={() => { }} />);
        expect(screen.getByText('Informasi Merchant')).toBeInTheDocument();
        // Alamat appears as section title and input label, so we expect multiple
        expect(screen.getAllByText('Alamat').length).toBeGreaterThan(0);
        expect(screen.getByText('Profil Usaha')).toBeInTheDocument();
    });

    it('updates data when input changes', () => {
        const updateData = vi.fn();
        render(<Step2DataUsaha data={{}} updateData={updateData} />);

        const input = screen.getByLabelText('Nama Merchant (Official)');
        fireEvent.change(input, { target: { value: 'PT Maju' } });

        expect(updateData).toHaveBeenCalledWith({ namaMerchantOfficial: 'PT Maju' });
    });

    it('enforces numeric input for telephone', () => {
        const updateData = vi.fn();
        render(<Step2DataUsaha data={{}} updateData={updateData} />);

        const input = screen.getByLabelText('No. Telepon Usaha / Merchant');
        fireEvent.change(input, { target: { value: '0812abc' } });

        expect(updateData).toHaveBeenCalledWith({ noTelponUsaha: '0812' });
    });

    it('handles radio group changes (Lingkungan Usaha)', () => {
        const updateData = vi.fn();
        render(<Step2DataUsaha data={{}} updateData={updateData} />);

        const option = screen.getByLabelText('Pemukiman');
        fireEvent.click(option);

        expect(updateData).toHaveBeenCalledWith({ lingkunganUsaha: 'pemukiman' });
    });
});
