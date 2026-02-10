import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import bankReducer from '../features/bankSlice';
import merchantReducer from '../features/merchantSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        bank: bankReducer,
        merchant: merchantReducer,
    },
});
