import React, { useState } from 'react';
import { FaCreditCard, FaSearch, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';

const BankCheck = ({ onVerified }) => {
    const [accountNumber, setAccountNumber] = useState('');
    const [error, setError] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Success States
    const [isSuccess, setIsSuccess] = useState(false);
    const [progress, setProgress] = useState(0);

    // DUMMY VALID DATA
    const VALID_ACCOUNT = '1234567890';

    const handleCheck = () => {
        if (!accountNumber) {
            setError('Nomor rekening harus diisi');
            return;
        }

        setIsLoading(true);
        setError('');

        // Simulate API call
        setTimeout(() => {
            if (accountNumber === VALID_ACCOUNT) {
                // Success Logic
                setIsLoading(false);
                setIsSuccess(true);

                // Start Progress Bar (5 seconds = 5000ms)
                const duration = 5000;
                const intervalTime = 50; // Update every 50ms
                const steps = duration / intervalTime;
                let currentStep = 0;

                const timer = setInterval(() => {
                    currentStep++;
                    const newProgress = Math.min((currentStep / steps) * 100, 100);
                    setProgress(newProgress);

                    if (currentStep >= steps) {
                        clearInterval(timer);
                        onVerified(accountNumber);
                    }
                }, intervalTime);

            } else {
                setIsLoading(false);
                setShowErrorModal(true);
            }
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
                <div className="text-center mb-8">
                    <div className="bg-yellow-100 p-4 rounded-full inline-block mb-4">
                        <FaCreditCard className="text-yellow-600 text-4xl" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Cek Rekening</h2>
                    <p className="text-gray-600 mt-2">
                        Masukan nomor rekening Bank Mandiri Taspen Anda untuk validasi.
                    </p>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Nomor Rekening</label>
                        <input
                            type="text"
                            value={accountNumber}
                            onChange={(e) => {
                                setAccountNumber(e.target.value.replace(/[^0-9]/g, ''));
                                setError('');
                            }}
                            disabled={isLoading || isSuccess}
                            placeholder="Contoh: 1234567890"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:bg-gray-100"
                        />
                        {isSuccess && (
                            <p className="text-green-600 font-bold text-sm mt-2 flex items-center justify-center gap-1 animate-pulse">
                                <FaCheckCircle /> Rekening Terdaftar! Mengalihkan...
                            </p>
                        )}
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    {isSuccess ? (
                        <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700">
                            <div
                                className="bg-green-600 h-4 rounded-full transition-all duration-75 ease-linear"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    ) : (
                        <button
                            onClick={handleCheck}
                            disabled={isLoading}
                            className={`w-full bg-[#1e3a8a] text-white font-bold py-3 rounded-lg shadow hover:bg-yellow-600 transition flex items-center justify-center gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? 'Memeriksa...' : (
                                <>
                                    Cek Rekening <FaSearch />
                                </>
                            )}
                        </button>
                    )}

                    <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded text-sm text-blue-800">
                        <strong>Info Simulasi:</strong> Gunakan <code>1234567890</code> untuk sukses. Angka lain akan gagal.
                    </div>
                </div>
            </div>

            {/* Error Modal */}
            {showErrorModal && (
                <div className="fixed inset-0 bg-black bg-opacity-[0.98] flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl p-6 max-w-sm w-full text-center shadow-2xl">
                        <div className="bg-orange-100 p-3 rounded-full inline-block mb-4">
                            <FaExclamationTriangle className="text-[#F3A530] text-3xl" />
                        </div>
                        <h3 className="text-xl font-bold text-[#1e3a8a] mb-2">Rekening Tidak Terdaftar</h3>
                        <p className="text-gray-600 mb-6">
                            Nomor rekening tersebut tidak ditemukan dalam sistem kami. Harap mengunjungi kantor cabang Bank Mandiri Taspen terdekat.
                        </p>
                        <button
                            onClick={() => setShowErrorModal(false)}
                            className="w-full bg-[#1e3a8a] text-white font-bold py-2 rounded-lg hover:bg-blue-800 transition shadow-lg"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BankCheck;
