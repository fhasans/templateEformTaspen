import React from 'react';
import { FaStore } from 'react-icons/fa';

const LandingPage = ({ onStart }) => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
            <div className="bg-white p-10 rounded-2xl shadow-xl max-w-2xl w-full flex flex-col items-center">
                <div className="bg-blue-100 p-4 rounded-full mb-6">
                    <FaStore className="text-[#1e3a8a] text-6xl" />
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-[#1e3a8a] mb-4">
                    Selamat Datang di Portal Merchant Mantap
                </h1>

                <p className="text-gray-600 text-lg mb-8 max-w-lg">
                    Bergabunglah menjadi mitra kami dan nikmati kemudahan transaksi digital.
                    Proses pendaftaran cepat, mudah, dan aman.
                </p>

                <div className="w-full h-px bg-gray-200 mb-8"></div>

                <button
                    onClick={onStart}
                    className="bg-[#1e3a8a] text-white text-lg font-bold px-8 py-4 rounded-lg shadow-md hover:bg-blue-800 transition-transform transform hover:scale-105"
                >
                    Mulai Pendaftaran
                </button>

                <p className="mt-6 text-sm text-gray-400">
                    &copy; 2026 Bank Mandiri Taspen. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default LandingPage;
