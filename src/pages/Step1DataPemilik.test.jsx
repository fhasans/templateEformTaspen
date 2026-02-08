import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import Step1DataPemilik from './Step1DataPemilik';

// Mock child components to isolate Step1 logic
vi.mock('../components/FormSection', () => ({
    default: ({ title, children }) => <div data-testid="form-section"><h3>{title}</h3>{children}</div>
}));

// We can render Input/Select directly if they are simple, 
// OR we can mock them to just specific test ids.
// Let's use real components if possible, BUT since we are unit testing Step1 logic, 
// mocking Input/Select gives us control over what events they emit.
// However, Step1 uses 'name' or 'label' to identify inputs.
// Let's Mock them for simplicity and speed.

vi.mock('../components/Input', () => ({
    default: ({ label, value, onChange, placeholder }) => (
        <div data-testid={`input-${label}`}>
            <label>{label}</label>
            <input
                aria-label={label}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
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

describe('Step1DataPemilik Component', () => {
    it('initializes default values on mount', () => {
        const updateData = vi.fn();
        render(<Step1DataPemilik data={{}} updateData={updateData} />);

        // Check if updateData was called with defaults
        expect(updateData).toHaveBeenCalledWith(expect.objectContaining({
            provinsi: 'dki_jakarta',
            kabKota: 'jakarta_barat',
            kodePos: '11530'
        }));
    });

    it('renders form fields', () => {
        render(<Step1DataPemilik data={{}} updateData={() => { }} />);
        expect(screen.getByText('Data Pemilik')).toBeInTheDocument();
        expect(screen.getByLabelText('Nama Pemilik/Pengurus')).toBeInTheDocument();
        expect(screen.getByLabelText('Nomor Identitas')).toBeInTheDocument();
    });

    it('updates data when input field changes', () => {
        const updateData = vi.fn();
        // Pass initial data to avoid useEffect override confusing things, 
        // though updateData mock will just catch calls.
        render(<Step1DataPemilik data={{}} updateData={updateData} />);

        const nameInput = screen.getByLabelText('Nama Pemilik/Pengurus');
        fireEvent.change(nameInput, { target: { value: 'Budi' } });

        expect(updateData).toHaveBeenCalledWith({ namaPemilik: 'Budi' });
    });

    it('updates data when select field changes', () => {
        const updateData = vi.fn();
        render(<Step1DataPemilik data={{}} updateData={updateData} />);

        const identitySelect = screen.getByLabelText('Jenis Identitas');
        fireEvent.change(identitySelect, { target: { value: 'sim' } });

        expect(updateData).toHaveBeenCalledWith({ jenisIdentitas: 'sim' });
    });

    it('handles radio buttons for Tipe Nasabah', () => {
        const updateData = vi.fn();
        render(<Step1DataPemilik data={{ tipeNasabah: 'perorangan' }} updateData={updateData} />);

        const badanUsahaRadio = screen.getByLabelText('Badan Usaha');
        fireEvent.click(badanUsahaRadio);

        expect(updateData).toHaveBeenCalledWith({ tipeNasabah: 'badan_usaha' });
    });
});
