import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import Header from './Header';

describe('Header Component', () => {
    it('renders title correctly', () => {
        render(<Header />);
        expect(screen.getByText('Daftar Merchant')).toBeInTheDocument();
        expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });
});
