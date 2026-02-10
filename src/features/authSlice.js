import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_ENDPOINTS } from '../config/api';

// Thunk: Send OTP
export const sendOtp = createAsyncThunk(
    'auth/sendOtp',
    async (email, { rejectWithValue }) => {
        try {
            const response = await fetch(API_ENDPOINTS.REQUEST_OTP, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (!data.success) {
                return rejectWithValue(data.message || 'Gagal mengirim OTP');
            }

            // If debug_otp is present (SMTP failed fallback), log it
            if (data.debug_otp) {
                console.warn('⚠️ [DEMO MODE] Email API Failed. Switching to Simulation.');
                console.log('%c [DEMO OTP] ' + data.debug_otp, 'background: #222; color: #bada55; font-size: 20px');
                console.log(`Use this code to verify: ${data.debug_otp}`);
            }

            return { email, isDemo: !!data.debug_otp };
        } catch (error) {
            console.error('Send OTP Error:', error);
            return rejectWithValue(error.message || 'Gagal mengirim OTP');
        }
    }
);


// Thunk: Verify OTP
export const verifyOtp = createAsyncThunk(
    'auth/verifyOtp',
    async ({ email, otp }, { rejectWithValue }) => {
        try {
            const response = await fetch(API_ENDPOINTS.VERIFY_OTP, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp })
            });

            const data = await response.json();

            if (!data.success) {
                return rejectWithValue(data.message || 'Kode OTP salah atau sudah kadaluarsa');
            }

            return email; // Verification success
        } catch (error) {
            console.error('Verify OTP Error:', error);
            return rejectWithValue(error.message || 'Verifikasi gagal');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        email: '',
        isOtpSent: false,
        isVerified: false,
        isLoading: false,
        error: null,
    },
    reducers: {
        resetAuth: (state) => {
            state.email = '';
            state.isOtpSent = false;
            state.isVerified = false;
            state.error = null;
        },
        setEmail: (state, action) => {
            state.email = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        // Send OTP Cases
        builder.addCase(sendOtp.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(sendOtp.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isOtpSent = true;
            state.email = action.meta.arg; // Ensure email is set
        });
        builder.addCase(sendOtp.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        });

        // Verify OTP Cases
        builder.addCase(verifyOtp.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(verifyOtp.fulfilled, (state) => {
            state.isLoading = false;
            state.isVerified = true;
        });
        builder.addCase(verifyOtp.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        });
    }
});

export const { resetAuth, setEmail, clearError } = authSlice.actions;
export default authSlice.reducer;
