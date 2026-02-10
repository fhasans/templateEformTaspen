import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_ENDPOINTS } from '../config/api';

// Thunk: Submit Application
export const submitApplication = createAsyncThunk(
    'merchant/submitApplication',
    async (payload, { rejectWithValue }) => {
        try {
            console.log('Redux Thunk / Submitting to Backend API:', payload);

            const response = await fetch(API_ENDPOINTS.REGISTER_MERCHANT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!data.success) {
                return rejectWithValue(data.message || 'Gagal menyimpan data');
            }

            return { id: data.ticket_id, ...data };
        } catch (error) {
            console.error('Submission Error:', error);
            return rejectWithValue(error.message || 'Gagal menyimpan data');
        }
    }
);

const merchantSlice = createSlice({
    name: 'merchant',
    initialState: {
        status: 'idle', // idle | loading | succeeded | failed
        error: null,
        submissionId: null
    },
    reducers: {
        resetSubmission: (state) => {
            state.status = 'idle';
            state.error = null;
            state.submissionId = null;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(submitApplication.pending, (state) => {
            state.status = 'loading';
            state.error = null;
        });
        builder.addCase(submitApplication.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.submissionId = action.payload.id;
        });
        builder.addCase(submitApplication.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload;
        });
    }
});

export const { resetSubmission } = merchantSlice.actions;
export default merchantSlice.reducer;
