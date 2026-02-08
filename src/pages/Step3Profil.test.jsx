import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import Step3Profil from './Step3Profil';

// Mock components
vi.mock('../components/FormSection', () => ({
    default: ({ title, children }) => <div><h3>{title}</h3>{children}</div>
}));

vi.mock('../components/Input', () => ({
    default: ({ label, value, onChange, placeholder, disabled }) => (
        <div data-testid={`input-${label}`}>
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

describe('Step3Profil Component', () => {
    it('renders correctly', () => {
        render(<Step3Profil data={{}} updateData={() => { }} />);
        expect(screen.getByText('Data Penanggung Jawab Usaha')).toBeInTheDocument();
        expect(screen.getByLabelText('Nama Penghubung (PIC 1)')).toBeInTheDocument();
    });

    it('autofills data from Owner when checkbox is checked', () => {
        const updateData = vi.fn();
        const ownerData = {
            namaPemilik: 'Budi Owner',
            noHpPemilik: '08111111'
        };

        render(<Step3Profil data={{}} updateData={updateData} dataPemilik={ownerData} />);

        const checkbox = screen.getByLabelText('Sama dengan Data Pemilik');
        fireEvent.click(checkbox);

        expect(updateData).toHaveBeenCalledWith({
            namaPIC1: 'Budi Owner',
            noHpPIC1: '08111111'
        });
    });

    it('disables inputs when checkbox is checked', () => {
        render(<Step3Profil data={{}} updateData={() => { }} dataPemilik={{}} />);

        const checkbox = screen.getByLabelText('Sama dengan Data Pemilik');
        const inputName = screen.getByLabelText('Nama Penghubung (PIC 1)');

        expect(inputName).not.toBeDisabled();

        fireEvent.click(checkbox);

        expect(inputName).toBeDisabled();
    });

    it('updates data manually when checkbox is unchecked', () => {
        const updateData = vi.fn();
        render(<Step3Profil data={{}} updateData={updateData} />);

        const inputName = screen.getByLabelText('Nama Penghubung (PIC 1)');
        fireEvent.change(inputName, { target: { value: 'Siti' } });

        expect(updateData).toHaveBeenCalledWith({ namaPIC1: 'Siti' });
    });
});
