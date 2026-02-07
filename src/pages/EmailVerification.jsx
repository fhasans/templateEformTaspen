import React, { useState } from 'react';
import { FaPaperPlane, FaCheckCircle, FaLock } from 'react-icons/fa';

const EmailVerification = ({ onVerified }) => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Mock "Server" OTP (In a real app, this comes from the backend)
    const [serverOtp, setServerOtp] = useState(null);

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleSendOtp = () => {
        if (!email) {
            setError('Email harus diisi');
            return;
        }
        if (!validateEmail(email)) {
            setError('Format email tidak valid');
            return;
        }

        setIsLoading(true);
        setError('');

        // Simulate API call delay
        setTimeout(() => {
            const mockOtp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6 digit random
            setServerOtp(mockOtp);
            setIsOtpSent(true);
            setIsLoading(false);

            // SHOW MOCK OTP TO USER via Alert/Console (Simulating receiving email)
            alert(`[MOCK EMAIL SERVER]\nTo: ${email}\nYour Verification Code is: ${mockOtp}`);
            console.log(`[MOCK EMAIL SERVER] OTP for ${email}: ${mockOtp}`);
        }, 1500);
    };

    const handleVerify = () => {
        if (otp === serverOtp) {
            // Success
            onVerified();
        } else {
            setError('Kode verifikasi salah. Silakan coba lagi.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
                <div className="text-center mb-8">
                    <div className="bg-blue-100 p-4 rounded-full inline-block mb-4">
                        <FaLock className="text-[#1e3a8a] text-4xl" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#1e3a8a]">Verifikasi Email</h2>
                    <p className="text-gray-600 mt-2">
                        {isOtpSent
                            ? `Masukan kode 6 digit yang telah dikirim ke ${email}`
                            : 'Silakan verifikasi email Anda sebelum melanjutkan pendaftaran merchant.'}
                    </p>
                </div>

                {!isOtpSent ? (
                    // Step 1: Input Email
                    <div className="space-y-6">
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Alamat Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="nama@perusahaan.com"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <button
                            onClick={handleSendOtp}
                            disabled={isLoading}
                            className={`w-full bg-[#1e3a8a] text-white font-bold py-3 rounded-lg shadow hover:bg-blue-900 transition flex items-center justify-center gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? 'Mengirim...' : (
                                <>
                                    Kirim Kode <FaPaperPlane />
                                </>
                            )}
                        </button>
                    </div>
                ) : (
                    // Step 2: Input OTP
                    <div className="space-y-6">
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Kode Verifikasi (OTP)</label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                                placeholder="123456"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] text-center text-2xl tracking-widest"
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <button
                            onClick={handleVerify}
                            className="w-full bg-green-600 text-white font-bold py-3 rounded-lg shadow hover:bg-green-700 transition flex items-center justify-center gap-2"
                        >
                            Verifikasi <FaCheckCircle />
                        </button>
                        <button
                            onClick={() => { setIsOtpSent(false); setOtp(''); setError(''); }}
                            className="w-full text-gray-500 text-sm hover:underline"
                        >
                            Ganti alamat email
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmailVerification;
