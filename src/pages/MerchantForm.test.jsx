import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom';
import MerchantForm from './MerchantForm';
import { validateStep } from '../utils/validation';

// Mock all child components to avoid testing their internal logic
// We just want to test the orchestration (navigation, state passing)
vi.mock('../components/Header', () => ({ default: () => <div data-testid="header" /> }));
vi.mock('../components/Stepper', () => ({ default: ({ currentStep }) => <div data-testid="stepper">Step {currentStep}</div> }));
vi.mock('../components/Modal', () => ({ default: ({ isOpen, title }) => isOpen ? <div data-testid="modal">{title}</div> : null }));

// Mock Step components
const MockStep = ({ title, data, updateData }) => (
    <div data-testid="mock-step">
        <h1>{title}</h1>
        <button onClick={() => updateData({ test: 'data' })}>Update Data</button>
    </div>
);

vi.mock('./Step4Keuangan', () => ({ default: (props) => <MockStep title="Step 1 Keuangan" {...props} /> }));
vi.mock('./Step1DataPemilik', () => ({ default: (props) => <MockStep title="Step 2 Data Pemilik" {...props} /> }));
vi.mock('./Step2DataUsaha', () => ({ default: (props) => <MockStep title="Step 3 Data Usaha" {...props} /> }));
vi.mock('./Step3Profil', () => ({ default: (props) => <MockStep title="Step 4 Profil" {...props} /> }));
vi.mock('./Step5DataTransaksi', () => ({ default: (props) => <MockStep title="Step 5 Transaksi" {...props} /> }));
vi.mock('./Step6Konfigurasi', () => ({ default: (props) => <MockStep title="Step 6 Konfigurasi" {...props} /> }));
vi.mock('./Step7Dokumen', () => ({ default: (props) => <MockStep title="Step 7 Dokumen" {...props} /> }));

// Mock Validation
vi.mock('../utils/validation', () => ({
    validateStep: vi.fn()
}));

describe('MerchantForm Orchestrator', () => {
    beforeEach(() => {
        // Mock sessionStorage
        const sessionStorageMock = (() => {
            let store = {};
            return {
                getItem: vi.fn((key) => store[key] || null),
                setItem: vi.fn((key, value) => { store[key] = value.toString(); }),
                removeItem: vi.fn((key) => { delete store[key]; }),
                clear: vi.fn(() => { store = {}; })
            };
        })();
        Object.defineProperty(window, 'sessionStorage', { value: sessionStorageMock });

        // Clear mocks
        vi.clearAllMocks();
    });

    it('renders Step 1 initially', () => {
        render(<MerchantForm />);
        expect(screen.getByText('Step 1 Keuangan')).toBeInTheDocument();
        expect(screen.getByText('Step 1')).toBeInTheDocument(); // Stepper
    });

    it('navigates to next step when validation passes', async () => {
        // Mock validation to pass
        validateStep.mockImplementation((step, data) => {
            console.log(`[TEST-DEBUG] Mock validateStep called for step ${step}`);
            return {};
        });

        render(<MerchantForm />);

        const nextButton = screen.getByText('Simpan dan Lanjut');
        console.log('[TEST-DEBUG] Clicking Next Button');
        fireEvent.click(nextButton);

        expect(validateStep).toHaveBeenCalled();
        console.log('[TEST-DEBUG] Next Button Clicked');

        await waitFor(() => {
            expect(screen.getByText('Step 2 Data Pemilik')).toBeInTheDocument();
            expect(sessionStorage.setItem).toHaveBeenCalledWith('merchantFormStep', '2');
        });
    });

    it('stays on current step if validation fails', async () => {
        // Mock validation to fail
        validateStep.mockReturnValue({ field: 'Error' });

        render(<MerchantForm />);

        const nextButton = screen.getByText('Simpan dan Lanjut');
        fireEvent.click(nextButton);

        // Should still be on Step 1
        expect(screen.getByText('Step 1 Keuangan')).toBeInTheDocument();
        expect(sessionStorage.setItem).not.toHaveBeenCalledWith('merchantFormStep', '2');
    });

    it('navigates to previous step', async () => {
        // Start at Step 2
        window.sessionStorage.getItem.mockImplementation((key) => {
            if (key === 'merchantFormStep') return '2';
            return null;
        });

        render(<MerchantForm />);
        expect(screen.getByText('Step 2 Data Pemilik')).toBeInTheDocument();

        const prevButton = screen.getByText('Sebelumnya');
        fireEvent.click(prevButton);

        await waitFor(() => {
            expect(screen.getByText('Step 1 Keuangan')).toBeInTheDocument();
        });
    });

    it('shows confirmation modal on final step', async () => {
        // Start at Step 7
        window.sessionStorage.getItem.mockImplementation((key) => {
            if (key === 'merchantFormStep') return '7';
            return null;
        });

        validateStep.mockReturnValue({}); // Pass validation

        render(<MerchantForm />);
        expect(screen.getByText('Step 7 Dokumen')).toBeInTheDocument();

        const submitButton = screen.getByText('Simpan dan Daftar');
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText('Daftar Merchant')).toBeInTheDocument(); // Modal Title
        });
    });
});
