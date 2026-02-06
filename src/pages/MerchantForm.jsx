import React, { useState } from 'react';
import Header from '../components/Header';
import Stepper from '../components/Stepper';
import Step1DataPemilik from './Step1DataPemilik';
import Step2DataUsaha from './Step2DataUsaha';
import Step3Profil from './Step3Profil';

import Step4Keuangan from './Step4Keuangan';
import Step5DataTransaksi from './Step5DataTransaksi';
import Step6Konfigurasi from './Step6Konfigurasi';
import Step7Dokumen from './Step7Dokumen';

const MerchantForm = () => {
    // Current Step State
    const [currentStep, setCurrentStep] = useState(() => {
        const savedStep = sessionStorage.getItem('merchantFormStep');
        return savedStep ? parseInt(savedStep, 10) : 1;
    });

    // Initialize state from sessionStorage or empty object
    const [formData, setFormData] = useState(() => {
        const savedData = sessionStorage.getItem('merchantFormData');
        return savedData ? JSON.parse(savedData) : {
            step4: {}, // Keuangan (Step 1 in UI flow but id 4?) Wait, Step4Keuangan is rendered when currentStep === 1 based on original code.
            // Let's structure it by logic or just flat?
            // User asked for "data di setiap tahap tersimpan".
            // Since the components are named Step1, Step2 etc but rendered in different order,
            // let's use the component names as keys to be safe.
            keuangan: {},
            dataPemilik: {},
            dataUsaha: {},
            profil: {},
            dataTransaksi: {},
            konfigurasi: {},
            dokumen: {}
        };
    });

    // Helper to update data for a specific section
    const updateFormData = (section, data) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                ...data
            }
        }));
    };

    const handleNext = () => {
        // Save to sessionStorage when "Simpan dan Lanjut" is clicked
        sessionStorage.setItem('merchantFormData', JSON.stringify(formData));

        if (currentStep < 7) {
            const nextStep = currentStep + 1;
            setCurrentStep(nextStep);
            sessionStorage.setItem('merchantFormStep', nextStep);
        }
    };

    const handlePrev = () => {
        const prevStep = currentStep - 1;
        setCurrentStep(prevStep);
        sessionStorage.setItem('merchantFormStep', prevStep);
    };

    return (
        <div className="min-h-screen bg-white p-6 md:p-10 font-sans text-gray-800">
            <div className="max-w-5xl mx-auto">
                <Header />

                <Stepper currentStep={currentStep} />

                {/* Content Area */}
                <div className="mb-8 mt-8">
                    {currentStep === 1 ? (
                        <Step4Keuangan
                            data={formData.keuangan}
                            updateData={(d) => updateFormData('keuangan', d)}
                        />
                    ) : currentStep === 2 ? (
                        <Step1DataPemilik
                            data={formData.dataPemilik}
                            updateData={(d) => updateFormData('dataPemilik', d)}
                        />
                    ) : currentStep === 3 ? (
                        <Step2DataUsaha
                            data={formData.dataUsaha}
                            updateData={(d) => updateFormData('dataUsaha', d)}
                        />
                    ) : currentStep === 4 ? (
                        <Step3Profil
                            data={formData.profil}
                            updateData={(d) => updateFormData('profil', d)}
                        />
                    ) : currentStep === 5 ? (
                        <Step5DataTransaksi
                            data={formData.dataTransaksi}
                            updateData={(d) => updateFormData('dataTransaksi', d)}
                        />
                    ) : currentStep === 6 ? (
                        <Step6Konfigurasi
                            data={formData.konfigurasi}
                            updateData={(d) => updateFormData('konfigurasi', d)}
                        />
                    ) : (
                        <Step7Dokumen
                            data={formData.dokumen}
                            updateData={(d) => updateFormData('dokumen', d)}
                        />
                    )}
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-end gap-4">
                    {currentStep > 1 && (
                        <button
                            className="px-6 py-2 bg-white font-semibold rounded text-gray-600 border border-gray-300 hover:bg-gray-50 transition-colors"
                            onClick={handlePrev}
                        >
                            Sebelumnya
                        </button>
                    )}
                    <button
                        className="px-6 py-2 bg-[#1e3a8a] text-white font-semibold rounded hover:bg-blue-800 transition-colors"
                        onClick={handleNext}
                    >
                        Simpan dan Lanjut
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MerchantForm;
