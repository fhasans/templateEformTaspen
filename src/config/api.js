// API Base URL Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const API_ENDPOINTS = {
    // Auth
    REQUEST_OTP: `${API_BASE_URL}/auth/otp`,
    VERIFY_OTP: `${API_BASE_URL}/auth/verify`,

    // Merchant
    REGISTER_MERCHANT: `${API_BASE_URL}/merchant/register`,
    CHECK_STATUS: `${API_BASE_URL}/merchant/status`,

    // Bank
    VALIDATE_BANK: `${API_BASE_URL}/bank/validate`,
    UPLOAD_FILE: `${API_BASE_URL}/upload`
};
