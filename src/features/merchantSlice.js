import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_ENDPOINTS } from '../config/api';

// Async Thunk to Upload Document
export const uploadDocument = createAsyncThunk(
    'merchant/uploadDocument',
    async (file, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(API_ENDPOINTS.UPLOAD_FILE, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (!data.success) {
                return rejectWithValue(data.message || 'Gagal mengupload dokumen');
            }

            // Return the file path relative to server root
            return {
                originalName: file.name,
                fileName: data.originalName,
                filePath: data.filePath,
                url: `${API_ENDPOINTS.BASE_URL}/${data.filePath}` // Construct full URL for preview
            };
        } catch (error) {
            console.error('Upload Error:', error);
            return rejectWithValue(error.message || 'Gagal mengupload dokumen');
        }
    }
);

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
        data: {},
        uploadedDocuments: {}, // Store paths: { 'ktp': '/uploads/...', 'npwp': '/uploads/...' }
        loading: false,
        error: null,
        ticketId: null,
        success: false
    },
    reducers: {
        resetSubmission: (state) => {
            state.loading = false;
            state.error = null;
            state.ticketId = null;
            state.success = false;
            state.data = {};
            state.uploadedDocuments = {};
        },
        setUploadedDocument: (state, action) => {
            const { docType, filePath, url } = action.payload;
            state.uploadedDocuments[docType] = { filePath, url };
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
