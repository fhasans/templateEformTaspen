import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import Modal from '../components/Modal';

describe('Modal Component', () => {
    it('does not render when isOpen is false', () => {
        render(
            <Modal
                isOpen={false}
                onClose={() => { }}
                title="Test Modal"
                message="Hello"
            />
        );
        expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
    });

    it('renders correctly when isOpen is true', () => {
        render(
            <Modal
                isOpen={true}
                onClose={() => { }}
                title="Test Modal"
                message="Hello Body"
            />
        );
        expect(screen.getByText('Test Modal')).toBeInTheDocument();
        expect(screen.getByText('Hello Body')).toBeInTheDocument();
    });

    it('calls onClose when Cancel is clicked', () => {
        const handleClose = vi.fn();
        render(
            <Modal
                isOpen={true}
                onClose={handleClose}
                title="Test"
                message="Body"
                type="confirm"
            />
        );

        fireEvent.click(screen.getByText('Tidak'));
        expect(handleClose).toHaveBeenCalled();
    });

    it('calls onConfirm when Yes is clicked', () => {
        const handleConfirm = vi.fn();
        render(
            <Modal
                isOpen={true}
                onClose={() => { }}
                onConfirm={handleConfirm}
                title="Test"
                message="Body"
                type="confirm"
            />
        );

        fireEvent.click(screen.getByText('Ya'));
        expect(handleConfirm).toHaveBeenCalled();
    });
});
