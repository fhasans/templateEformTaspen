import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_ENDPOINTS } from '../config/api';

// Thunk: Check Account
export const checkAccount = createAsyncThunk(
    'bank/checkAccount',
    async ({ accountNumber, bankName }, { rejectWithValue }) => {
        try {
            const response = await fetch(API_ENDPOINTS.VALIDATE_BANK, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ accountNumber, bankName })
            });

            const result = await response.json();

            if (!result.success) {
                return rejectWithValue(result.message || 'Rekening tidak ditemukan');
            }

            // Simulate delay for UX
            await new Promise(resolve => setTimeout(resolve, 1000));

            return result.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const bankSlice = createSlice({
    name: 'bank',
    initialState: {
        accountNumber: '',
        accountData: null,
        isValid: false,
        isLoading: false,
        error: null,
        progress: 0,
    },
    reducers: {
        setAccountNumber: (state, action) => {
            state.accountNumber = action.payload;
        },
        resetBankCheck: (state) => {
            state.accountNumber = '';
            state.isValid = false;
            state.accountData = null;
            state.error = null;
            state.progress = 0;
        },
        updateProgress: (state, action) => {
            state.progress = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(checkAccount.pending, (state) => {
            state.isLoading = true;
            state.error = null;
            state.isValid = false;
        });
        builder.addCase(checkAccount.fulfilled, (state, action) => {
            state.isLoading = false;
            state.accountData = action.payload;
            // Note: We don't set isValid=true immediately to allow progress bar animation
        });
        builder.addCase(checkAccount.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            state.isValid = false;
        });
    }
});

export const { setAccountNumber, resetBankCheck, updateProgress } = bankSlice.actions;
export default bankSlice.reducer;
