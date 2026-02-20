import React, { useEffect } from 'react';
import { FaCreditCard, FaSearch, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { checkAccount, setAccountNumber, resetBankCheck, updateProgress } from '../features/bankSlice';

const BankCheck = ({ onVerified }) => {
    // Local State
    const [accountNumber, setAccountNumber] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const [loadingMessage, setLoadingMessage] = React.useState('Memeriksa...');
    const [error, setError] = React.useState(null); // 'not_found' or 'inactive'

    // UI State for 2-step process
    const [isAccountFound, setIsAccountFound] = React.useState(false); // New intermediate state
    const [verifiedAccount, setVerifiedAccount] = React.useState(null); // Store found account temporarily

    // Success handling
    const [localIsSuccess, setLocalIsSuccess] = React.useState(false);
    const [progress, setProgress] = React.useState(0);

    // Dummy data for simulation
    const DUMMY_ACCOUNTS = {
        '1234567890': {
            nama: 'Budi Santoso',
            cabang: 'MANTAP JAKARTA',
            tipe: 'Tabungan',
            status: 'active'
        },
        '0987654321': {
            nama: 'PT. Maju Mundur',
            cabang: 'MANTAP SURABAYA',
            tipe: 'Giro',
            status: 'active'
        },
        '1111111111': {
            nama: 'Budi (Inactive)',
            cabang: 'MANTAP BANDUNG',
            tipe: 'Tabungan',
            status: 'inactive'
        }
    };

    // Unified Check Function (Single Step)
    const handleCheck = () => {
        if (!accountNumber) {
            alert('Nomor rekening harus diisi');
            return;
        }

        setIsLoading(true);
        setLoadingMessage("Memeriksa data rekening...");
        setError(null);

        // Simulate API Search & Status Check combined
        setTimeout(() => {
            const account = DUMMY_ACCOUNTS[accountNumber];

            if (!account) {
                // Not Found -> Popup
                setError('not_found');
                setIsLoading(false);
            } else {
                // Found -> Check Status
                if (account.status === 'active') {
                    // Active -> Success -> Progress -> Redirect
                    setVerifiedAccount(account); // Set account for display
                    setLocalIsSuccess(true);

                    const finalData = { ...account, nomorRekening: accountNumber };

                    // Progress animation
                    let currentProgress = 0;
                    const interval = setInterval(() => {
                        currentProgress += 5;
                        setProgress(currentProgress);
                        if (currentProgress >= 100) {
                            clearInterval(interval);
                            onVerified(finalData);
                        }
                    }, 50);
                } else {
                    // Inactive -> Popup
                    setError('inactive');
                    setIsLoading(false);
                }
            }
        }, 1500); // Slightly longer simulated delay for "full check"
    };

    const handleReset = () => {
        // setIsAccountFound(false); // REMOVED
        setVerifiedAccount(null);
        setAccountNumber('');
        setError(null);
    };

    const handleCloseError = () => {
        setError(null);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full animate-fade-in">
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
                                // if (isAccountFound) { // REMOVED
                                //     setIsAccountFound(false); // Reset if user changes types
                                //     setVerifiedAccount(null);
                                // }
                            }}
                            disabled={isLoading || localIsSuccess}
                            placeholder="Contoh: 1234567890"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:bg-gray-100 transition-all"
                        />
                        {localIsSuccess && (
                            <p className="text-green-600 font-bold text-sm mt-3 flex items-center justify-center gap-1 animate-pulse">
                                <FaCheckCircle /> Rekening Aktif! Mengalihkan...
                            </p>
                        )}
                    </div>

                    {/* Display Found Account Name (Only on Success/Progress) */}
                    {localIsSuccess && verifiedAccount && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-2 animate-fade-in">
                            <p className="text-sm text-gray-500 mb-1">Nama Pemilik Rekening:</p>
                            <p className="text-lg font-bold text-[#1e3a8a]">{verifiedAccount.nama}</p>
                        </div>
                    )}

                    {localIsSuccess ? (
                        <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700 overflow-hidden">
                            <div
                                className="bg-green-600 h-4 rounded-full transition-all duration-75 ease-linear"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    ) : (
                        <button
                            onClick={handleCheck}
                            disabled={isLoading}
                            className={`w-full text-white font-bold py-3 rounded-lg shadow transition flex items-center justify-center gap-2 ${isLoading
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-[#1e3a8a] hover:bg-blue-800'
                                }`}
                        >
                            {isLoading ? loadingMessage : (
                                <>
                                    Cek Rekening <FaSearch />
                                </>
                            )}
                        </button>
                    )}

                    <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded text-sm text-blue-800">
                        <strong>Info Simulasi:</strong> <br />
                        <code>1234567890</code> : Aktif (Sukses)<br />
                        <code>1111111111</code> : Tidak Aktif (Gagal)<br />
                        <code>999</code> : Tidak Ditemukan (Gagal)
                    </div>
                </div>
            </div>

            {/* Error Modal */}
            {error && (
                <div className="fixed inset-0 bg-black bg-opacity-[0.6] flex items-center justify-center p-4 z-50 animate-fade-in">
                    <div className="bg-white rounded-xl p-6 max-w-sm w-full text-center shadow-2xl transform transition-all scale-100">
                        <div className="bg-orange-100 p-3 rounded-full inline-block mb-4">
                            <FaExclamationTriangle className="text-[#F3A530] text-3xl" />
                        </div>
                        <h3 className="text-xl font-bold text-[#1e3a8a] mb-2">
                            {error === 'not_found' ? 'Rekening Tidak Terdaftar' : 'Rekening Tidak Aktif'}
                        </h3>
                        <p className="text-gray-600 mb-6">
                            {error === 'not_found'
                                ? "Nomor rekening tersebut tidak ditemukan dalam sistem kami. Harap mengunjungi kantor cabang Bank Mandiri Taspen terdekat."
                                : "Nomor rekening tersebut tidak aktif. Harap mengunjungi kantor cabang Bank Mandiri Taspen terdekat untuk melakukan aktivasi."
                            }
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
