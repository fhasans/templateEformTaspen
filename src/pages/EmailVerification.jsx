import React, { useEffect } from 'react';
import { FaPaperPlane, FaCheckCircle, FaLock } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { sendOtp, verifyOtp, setEmail, clearError, resetAuth } from '../features/authSlice';

const EmailVerification = ({ onVerified }) => {
    const dispatch = useDispatch();
    const { email, isOtpSent, isVerified, isLoading, error } = useSelector((state) => state.auth);
    const [otp, setOtp] = React.useState('');

    const [localError, setLocalError] = React.useState('');

    // Trigger parent callback when verified
    useEffect(() => {
        if (isVerified) {
            onVerified(email);
        }
    }, [isVerified, email, onVerified]);

    // Clear errors on mount
    useEffect(() => {
        dispatch(clearError());
        setLocalError('');
    }, [dispatch]);

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleSendOtp = () => {
        setLocalError('');

        if (!email) {
            setLocalError('Email harus diisi');
            return;
        }
        if (!validateEmail(email)) {
            setLocalError('Format email tidak valid (contoh: nama@perusahaan.com)');
            return;
        }
        dispatch(sendOtp(email));
    };

    const handleVerify = () => {
        if (otp.length !== 6) {
            alert('Kode OTP harus 6 digit');
            return;
        }
        dispatch(verifyOtp({ email, otp }));
    };

    const handleReset = () => {
        dispatch(resetAuth());
        setOtp('');
        setLocalError('');
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
                                onChange={(e) => {
                                    dispatch(setEmail(e.target.value));
                                    if (localError) setLocalError('');
                                }}
                                placeholder="nama@perusahaan.com"
                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${localError || error
                                        ? 'border-red-500 focus:ring-red-500'
                                        : 'border-gray-300 focus:ring-[#1e3a8a]'
                                    } transition-all`}
                            />
                            {(localError || error) && (
                                <p className="text-red-500 text-sm mt-1 animate-fade-in">
                                    {localError || error}
                                </p>
                            )}
                        </div>

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
                            disabled={isLoading}
                            className={`w-full bg-green-600 text-white font-bold py-3 rounded-lg shadow hover:bg-green-700 transition flex items-center justify-center gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? 'Memproses...' : (
                                <>
                                    Verifikasi <FaCheckCircle />
                                </>
                            )}
                        </button>
                        <button
                            onClick={handleReset}
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
