import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom';
import Step7Dokumen from './Step7Dokumen';

// Mock components
vi.mock('../components/FormSection', () => ({
    default: ({ title, children }) => <div><h3>{title}</h3>{children}</div>
}));

// Mock react-icons
vi.mock('react-icons/fa', () => ({
    FaEye: () => <span>View</span>,
    FaTrash: () => <span>Delete</span>
}));

describe('Step7Dokumen Component', () => {
    beforeEach(() => {
        global.URL.createObjectURL = vi.fn(() => 'mock-url');
        window.alert = vi.fn();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('renders all file upload sections', () => {
        render(<Step7Dokumen data={{}} updateData={() => { }} />);
        expect(screen.getByText('Upload Dokumen')).toBeInTheDocument();
        expect(screen.getByText('Foto KTP Pemilik/Pengurus')).toBeInTheDocument();
        expect(screen.getByText('Foto NPWP')).toBeInTheDocument();
        expect(screen.getByText('Foto Tampak Depan Tempat Usaha')).toBeInTheDocument();
    });

    it('handles single file upload', () => {
        const updateData = vi.fn();
        render(<Step7Dokumen data={{}} updateData={updateData} />);

        // Find input for KTP (the first input with type file usually, but better to target by label)
        // Since FileInput is not mocked, we traverse DOM.
        // Structure: Label -> div -> div -> label -> input[type=file]
        // We can use getByLabelText on the outer label? No, input is inside.
        // The accessible label text might be tricky.

        // Let's rely on the text content to find the container, then find input.
        const ktpLabel = screen.getByText('Foto KTP Pemilik/Pengurus');
        const container = ktpLabel.closest('.mb-6');
        const fileInput = container.querySelector('input[type="file"]');

        const file = new File(['dummy content'], 'ktp.png', { type: 'image/png' });
        fireEvent.change(fileInput, { target: { files: [file] } });

        expect(updateData).toHaveBeenCalledWith(expect.objectContaining({
            fotoKTP: expect.arrayContaining([file])
        }));
    });

    it('handles document removal', () => {
        const updateData = vi.fn();
        const mockFile = { name: 'existing.jpg', url: 'mock-url' };
        // data.tampakDepan is array
        render(<Step7Dokumen data={{ tampakDepan: [mockFile] }} updateData={updateData} />);

        expect(screen.getByText('existing.jpg')).toBeInTheDocument();

        const deleteBtn = screen.getByTitle('Delete');
        fireEvent.click(deleteBtn);

        expect(updateData).toHaveBeenCalledWith({ tampakDepan: [] });
    });

    it('requires title for "Dokumen Lainnya"', () => {
        const updateData = vi.fn();
        render(<Step7Dokumen data={{}} updateData={updateData} />);

        const othersLabel = screen.getByText('Dokumen Lainnya');
        const container = othersLabel.closest('.mb-6');
        const fileInput = container.querySelector('input[type="file"]');

        // Create file
        const file = new File(['content'], 'other.pdf', { type: 'application/pdf' });

        // Try adding without title (input disabled logic in component preventing click? 
        // No, input is hidden but label wraps it. 
        // Component logic: disabled={!title.trim()} on input.
        // So fireEvent might not work if disabled.
        expect(fileInput).toBeDisabled();

        // Enter title
        const titleInput = screen.getByPlaceholderText('Input Judul Dokumen');
        fireEvent.change(titleInput, { target: { value: 'My Doc' } });

        expect(fileInput).not.toBeDisabled();

        fireEvent.change(fileInput, { target: { files: [file] } });

        expect(updateData).toHaveBeenCalledWith(expect.objectContaining({
            dokumenLainnya: expect.arrayContaining([
                expect.objectContaining({ customTitle: 'My Doc', name: 'other.pdf' })
            ])
        }));
    });
});
