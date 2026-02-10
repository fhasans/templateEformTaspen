import React, { useEffect } from 'react';
import { FaCreditCard, FaSearch, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { checkAccount, setAccountNumber, resetBankCheck, updateProgress } from '../features/bankSlice';

const BankCheck = ({ onVerified }) => {
    const dispatch = useDispatch();
    const { accountNumber, accountData, isLoading, error, isValid, progress } = useSelector((state) => state.bank);
    const [showErrorModal, setShowErrorModal] = React.useState(false);
    const [localIsSuccess, setLocalIsSuccess] = React.useState(false);

    // Sync local success state with accountData presence
    useEffect(() => {
        if (accountData) {
            setLocalIsSuccess(true);
            // Start progress animation
            const duration = 5000;
            const intervalTime = 50;
            const steps = duration / intervalTime;
            let currentStep = 0;

            const timer = setInterval(() => {
                currentStep++;
                const newProgress = Math.min((currentStep / steps) * 100, 100);
                dispatch(updateProgress(newProgress));

                if (currentStep >= steps) {
                    clearInterval(timer);
                    onVerified(accountNumber);
                }
            }, intervalTime);

            return () => clearInterval(timer);
        }
    }, [accountData, accountNumber, onVerified, dispatch]);

    // Handle errors
    useEffect(() => {
        if (error) {
            setShowErrorModal(true);
        }
    }, [error]);

    const handleCheck = () => {
        if (!accountNumber) {
            // Local validation
            alert('Nomor rekening harus diisi');
            return;
        }
        dispatch(checkAccount({ accountNumber, bankName: 'Bank Mandiri Taspen' }));
    };

    const handleCloseError = () => {
        setShowErrorModal(false);
        // Optional: clear error in redux if needed, but not strictly required as we just closed the modal
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
                                dispatch(setAccountNumber(e.target.value.replace(/[^0-9]/g, '')));
                            }}
                            disabled={isLoading || localIsSuccess}
                            placeholder="Contoh: 1234567890"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:bg-gray-100"
                        />
                        {localIsSuccess && (
                            <p className="text-green-600 font-bold text-sm mt-2 flex items-center justify-center gap-1 animate-pulse">
                                <FaCheckCircle /> Rekening Terdaftar! Mengalihkan...
                            </p>
                        )}
                    </div>
                    {/* Error handled via Modal, but can display here too if needed */}

                    {localIsSuccess ? (
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
                        <strong>Info Simulasi:</strong> Gunakan <code>1234567890</code> (PT Maju Jaya) untuk sukses.
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
                            onClick={handleCloseError}
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
