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
import Modal from '../components/Modal';
import { validateStep } from '../utils/validation';

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
            keuangan: {},
            dataPemilik: {},
            dataUsaha: {},
            profil: {},
            dataTransaksi: {},
            konfigurasi: {},
            dokumen: {}
        };
    });

    // Validation errors state
    const [validationErrors, setValidationErrors] = useState({});

    // Modal states
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

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
        console.log('handleNext called, currentStep:', currentStep);
        console.log('formData.keuangan:', formData.keuangan);

        // Get the data for the current step based on step number
        const stepDataMap = {
            1: formData.keuangan,
            2: { ...formData.dataPemilik, tipeNasabah: formData.dataPemilik.tipeNasabah },
            3: { ...formData.dataUsaha, tipeNasabah: formData.dataPemilik.tipeNasabah },
            4: formData.profil,
            5: formData.dataTransaksi,
            6: { ...formData.konfigurasi, tipeLayananQRIS: formData.dataPemilik.tipeLayananQRIS },
            7: formData.dokumen
        };

        console.log('Step data being validated:', stepDataMap[currentStep]);

        // Validate current step
        const errors = validateStep(currentStep, stepDataMap[currentStep]);

        console.log('Validation errors:', errors);

        if (Object.keys(errors).length > 0) {
            // There are validation errors, do not proceed
            console.log('Validation failed, setting errors');
            setValidationErrors(errors);
            // Scroll to top to show validation errors
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        console.log('Validation passed, proceeding to next step');

        // Clear any previous validation errors
        setValidationErrors({});

        // For Step 7, show confirmation modal instead of proceeding
        if (currentStep === 7) {
            setShowConfirmModal(true);
            return;
        }

        // Save to sessionStorage when "Simpan dan Lanjut" is clicked
        sessionStorage.setItem('merchantFormData', JSON.stringify(formData));

        if (currentStep < 7) {
            const nextStep = currentStep + 1;
            setCurrentStep(nextStep);
            sessionStorage.setItem('merchantFormStep', nextStep);
        }
    };

    // --- PAYLOAD STRUCTURING FOR API ---
    const constructPayload = () => {
        // Mapping internal state to API-ready JSON structure
        const payload = {
            submission_date: new Date().toISOString(),
            merchant_data: {
                // Step 1: Data Pemilik
                owner: {
                    name: formData.dataPemilik.namaPemilik,
                    identity_type: 'KTP', // Hardcoded as per form assumption or add field if exists
                    identity_number: formData.dataPemilik.nik,
                    phone: formData.dataPemilik.noHp,
                    email: formData.dataPemilik.email, // If we captured this, or use dummy
                    address: {
                        province: formData.dataPemilik.provinsi,
                        city: formData.dataPemilik.kabKota,
                        district: formData.dataPemilik.kecamatan,
                        subdistrict: formData.dataPemilik.kelurahan,
                        postal_code: formData.dataPemilik.kodePos,
                        full_address: formData.dataPemilik.alamatLengkap
                    }
                },
                // Step 2: Data Usaha
                business: {
                    name: formData.dataUsaha.namaUsaha,
                    type: formData.dataUsaha.jenisUsaha,
                    business_form: formData.dataUsaha.bentukUsaha,
                    business_type: formData.dataUsaha.tipeBisnis,
                    address: {
                        province: formData.dataUsaha.provinsiUsaha,
                        city: formData.dataUsaha.kabKotaUsaha,
                        district: formData.dataUsaha.kecamatanUsaha,
                        subdistrict: formData.dataUsaha.kelurahanUsaha,
                        postal_code: formData.dataUsaha.kodePosUsaha,
                        full_address: formData.dataUsaha.alamatUsaha
                    }
                },
                // Step 4 (Now Step 1 logic): Keuangan
                financial: {
                    bank_name: 'Bank Mandiri Taspen',
                    account_number: formData.keuangan.nomorRekening,
                    account_holder: formData.keuangan.namaPemilikRekening,
                    customer_type: formData.dataPemilik.tipeNasabah // Linked from owner step
                },
                // Step 6: Konfigurasi & Transaksi
                configuration: {
                    acquisition_branch: formData.konfigurasi.kodeCabangAkusisi,
                    location_branch: formData.konfigurasi.kodeCabangLokasi,
                    mcc_code: formData.konfigurasi.kodeMCC,
                    business_category: formData.konfigurasi.kategoriUsaha,
                    mdr_rate: formData.konfigurasi.mdr,
                    qris_service_type: formData.dataPemilik.tipeLayananQRIS,
                    projected_transaction: {
                        yearly_turnover: formData.dataTransaksi.omsetPerTahun,
                        avg_transaction: formData.dataTransaksi.avgTransaksi,
                        max_transaction: formData.dataTransaksi.maxTransaksi,
                        daily_freq: formData.dataTransaksi.freqHarian
                    }
                },
                // Documents (File paths/names)
                documents: {
                    ktp: formData.dokumen.fotoKTP ? formData.dokumen.fotoKTP.map(f => f.name) : [],
                    npwp: formData.dokumen.fotoNPWP ? formData.dokumen.fotoNPWP.map(f => f.name) : [],
                    merchant_form: formData.dokumen.formulirPermohonan ? formData.dokumen.formulirPermohonan.map(f => f.name) : [],
                    others: formData.dokumen.dokumenLainnya ? formData.dokumen.dokumenLainnya.map(d => ({ title: d.namaDokumen, file: d.file ? d.file.name : '' })) : []
                }
            }
        };

        return payload;
    };

    const handleSubmit = () => {
        // Close confirmation modal
        setShowConfirmModal(false);

        // PREPARE PAYLOAD
        const apiPayload = constructPayload();

        // LOG PAYLOAD AS REQUESTED
        console.log('>>> READY TO SEND TO API <<<');
        console.log('Payload Structure:', apiPayload);
        // console.log(JSON.stringify(apiPayload, null, 2)); // Uncomment to see stringified version

        // Simulate successful submission
        setTimeout(() => {
            // Clear all session storage
            sessionStorage.removeItem('merchantFormData');
            sessionStorage.removeItem('merchantFormStep');
            sessionStorage.removeItem('onboardingStarted');

            // Show success modal
            setShowSuccessModal(true);
        }, 500);
    };

    const handleSuccessClose = () => {
        setShowSuccessModal(false);
        // Redirect to landing page by refreshing
        window.location.href = '/';
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
                            errors={validationErrors}
                        />
                    ) : currentStep === 2 ? (
                        <Step1DataPemilik
                            data={formData.dataPemilik}
                            updateData={(d) => updateFormData('dataPemilik', d)}
                            errors={validationErrors}
                        />
                    ) : currentStep === 3 ? (
                        <Step2DataUsaha
                            data={formData.dataUsaha}
                            updateData={(d) => updateFormData('dataUsaha', d)}
                            errors={validationErrors}
                        />
                    ) : currentStep === 4 ? (
                        <Step3Profil
                            data={formData.profil}
                            updateData={(d) => updateFormData('profil', d)}
                            dataPemilik={formData.dataPemilik}
                            errors={validationErrors}
                        />
                    ) : currentStep === 5 ? (
                        <Step5DataTransaksi
                            data={formData.dataTransaksi}
                            updateData={(d) => updateFormData('dataTransaksi', d)}
                            errors={validationErrors}
                        />
                    ) : currentStep === 6 ? (
                        <Step6Konfigurasi
                            data={formData.konfigurasi}
                            updateData={(d) => updateFormData('konfigurasi', d)}
                            dataPemilik={formData.dataPemilik}
                            errors={validationErrors}
                        />
                    ) : (
                        <Step7Dokumen
                            data={formData.dokumen}
                            updateData={(d) => updateFormData('dokumen', d)}
                            errors={validationErrors}
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
                        className="px-6 py-2 bg-[#1e3a8a] text-white font-semibold rounded hover:bg-blue-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        onClick={handleNext}
                    >
                        {currentStep === 7 ? 'Simpan dan Daftar' : 'Simpan dan Lanjut'}
                    </button>
                </div>

                {/* Confirmation Modal */}
                <Modal
                    isOpen={showConfirmModal}
                    onClose={() => setShowConfirmModal(false)}
                    title="Daftar Merchant"
                    message="Apakah anda yakin ingin mengajukan pembuatan Merchant?"
                    onConfirm={handleSubmit}
                    confirmText="Ya"
                    cancelText="Tidak"
                    type="confirm"
                />

                {/* Success Modal */}
                <Modal
                    isOpen={showSuccessModal}
                    onClose={handleSuccessClose}
                    title="Daftar Merchant"
                    message="Sukses pembuatan Merchant."
                    type="success"
                />
            </div>
        </div>
    );
};

export default MerchantForm;
