import React from 'react';
import { FaIdCard, FaBriefcase, FaUser, FaStore, FaFileInvoice, FaCog, FaFileAlt } from 'react-icons/fa';

const steps = [
    { id: 1, icon: FaStore, label: 'Keuangan' },
    { id: 2, icon: FaIdCard, label: 'Data Pemilik' },
    { id: 3, icon: FaBriefcase, label: 'Data Usaha' },
    { id: 4, icon: FaUser, label: 'Profil' },
    { id: 5, icon: FaFileInvoice, label: 'Data Transaksi' },
    { id: 6, icon: FaCog, label: 'Konfigurasi' },
    { id: 7, icon: FaFileAlt, label: 'Dokumen' },
];

const Stepper = ({ currentStep }) => {
    return (
        <div className="flex items-center justify-between mb-8 relative px-4">
            {/* Connector Line */}
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -z-10 transform -translate-y-1/2"></div>

            {steps.map((step, index) => {
                const isActive = step.id === currentStep;
                const isCompleted = step.id < currentStep;

                return (
                    <div key={step.id} className="relative flex flex-col items-center group">
                        <div
                            className={`w-14 h-14 flex items-center justify-center rounded-lg z-10 transition-colors
                ${isActive ? 'bg-[#1e3a8a] text-white' : 'bg-gray-300 text-white'}
                ${isCompleted ? 'bg-[#1e3a8a] text-white' : ''}
              `}
                        >
                            <step.icon size={28} />
                        </div>

                        {/* Triangle Pointer for Active Step */}
                        {isActive && (
                            <div className="absolute -bottom-3 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-[#1e3a8a]"></div>
                        )}

                        {/* Label */}
                        <span className={`text-[10px] mt-1 font-medium ${isActive ? 'text-[#1e3a8a]' : 'text-gray-400'}`}>
                            {step.label}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

export default Stepper;
