import CryptoJS from 'crypto-js';

const SECRET_KEY = import.meta.env.VITE_STORAGE_SECRET_KEY || 'default-secret-key-change-me';

export const secureStorage = {
    setItem: (key, value) => {
        try {
            const jsonValue = JSON.stringify(value);
            const encrypted = CryptoJS.AES.encrypt(jsonValue, SECRET_KEY).toString();
            sessionStorage.setItem(key, encrypted);
        } catch (error) {
            console.error('Error encrypting data', error);
        }
    },

    getItem: (key) => {
        try {
            const encrypted = sessionStorage.getItem(key);
            if (!encrypted) return null;

            const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
            const decrypted = bytes.toString(CryptoJS.enc.Utf8);

            if (!decrypted) return null;

            return JSON.parse(decrypted);
        } catch (error) {
            console.error('Error decrypting data', error);
            return null;
        }
    },

    removeItem: (key) => {
        sessionStorage.removeItem(key);
    },

    clear: () => {
        sessionStorage.clear();
    }
};
