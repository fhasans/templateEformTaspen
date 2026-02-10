import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { submitApplication, resetSubmission } from '../features/merchantSlice';
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

const MerchantForm = ({ userEmail }) => {
    const dispatch = useDispatch();
    const { status, error, submissionId } = useSelector((state) => state.merchant);

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

    // Handle Redux Submission Status
    useEffect(() => {
        if (status === 'succeeded') {
            setShowSuccessModal(true);
            // Clear storage
            sessionStorage.removeItem('merchantFormData');
            sessionStorage.removeItem('merchantFormStep');
            sessionStorage.removeItem('onboardingStarted');
            sessionStorage.removeItem('isEmailVerified');
            sessionStorage.removeItem('isBankVerified');
            sessionStorage.removeItem('userEmail');
        } else if (status === 'failed') {
            alert('Gagal menyimpan data: ' + error);
        }
    }, [status, error]);

    // Clean up on unmount
    useEffect(() => {
        return () => {
            if (status === 'succeeded' || status === 'failed') {
                dispatch(resetSubmission());
            }
        }
    }, [dispatch, status]);


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
        // ... (Validation logic remains same) ...
        const stepDataMap = {
            1: formData.keuangan,
            2: { ...formData.dataPemilik, tipeNasabah: formData.dataPemilik.tipeNasabah },
            3: { ...formData.dataUsaha, tipeNasabah: formData.dataPemilik.tipeNasabah },
            4: formData.profil,
            5: formData.dataTransaksi,
            6: { ...formData.konfigurasi, tipeLayananQRIS: formData.dataPemilik.tipeLayananQRIS },
            7: formData.dokumen
        };

        const errors = validateStep(currentStep, stepDataMap[currentStep]);

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        setValidationErrors({});

        if (currentStep === 7) {
            setShowConfirmModal(true);
            return;
        }

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
                // ... (Mapping remains mostly same, just ensuring correct field access) ...
                // Email & Verification (from prop)
                email: userEmail || sessionStorage.getItem('userEmail'),
                email_verified: true,

                // Data Pemilik (Step 1)
                tipe_nasabah: formData.dataPemilik.tipeNasabah,
                tipe_layanan_qris: formData.dataPemilik.tipeLayananQRIS,
                jenis_identitas: formData.dataPemilik.jenisIdentitas,
                nomor_identitas: formData.dataPemilik.nomorIdentitas,
                nama_pemilik: formData.dataPemilik.namaPemilik,
                no_hp_pemilik: formData.dataPemilik.noHpPemilik,
                npwp_pemilik: formData.dataPemilik.npwpPemilik,
                alamat: formData.dataPemilik.alamat,
                rt: formData.dataPemilik.rt,
                rw: formData.dataPemilik.rw,
                provinsi: formData.dataPemilik.provinsi,
                kab_kota: formData.dataPemilik.kabKota,
                kecamatan: formData.dataPemilik.kecamatan,
                kelurahan: formData.dataPemilik.kelurahan,
                kode_pos: formData.dataPemilik.kodePos,

                // Data Usaha (Step 2)
                jenis_usaha: formData.dataUsaha.jenisUsaha,
                nama_merchant_official: formData.dataUsaha.namaMerchantOfficial,
                nama_merchant_qr: formData.dataUsaha.namaMerchantQR,
                email_notifikasi: formData.dataUsaha.emailNotifikasi,
                email_msr: formData.dataUsaha.emailMSR,
                bentuk_usaha: formData.dataUsaha.bentukUsaha,
                no_telpon_usaha: formData.dataUsaha.noTelponUsaha,
                instagram: formData.dataUsaha.instagram,
                alamat_usaha: formData.dataUsaha.alamatUsaha,
                rt_usaha: formData.dataUsaha.rtUsaha,
                rw_usaha: formData.dataUsaha.rwUsaha,
                provinsi_usaha: formData.dataUsaha.provinsiUsaha,
                kab_kota_usaha: formData.dataUsaha.kabKotaUsaha,
                kecamatan_usaha: formData.dataUsaha.kecamatanUsaha,
                kelurahan_usaha: formData.dataUsaha.kelurahanUsaha,
                kode_pos_usaha: formData.dataUsaha.kodePosUsaha,
                lingkungan_usaha: formData.dataUsaha.lingkunganUsaha,
                status_tempat: formData.dataUsaha.statusTempat,
                bidang_usaha: formData.dataUsaha.bidangUsaha,
                lama_usaha: parseInt(formData.dataUsaha.lamaUsaha) || 0,
                jumlah_karyawan: parseInt(formData.dataUsaha.jumlahKaryawan) || 0,

                // Profil (Step 3)
                nama_pic1: formData.profil.namaPIC1,
                nama_pic2: formData.profil.namaPIC2,
                no_hp_pic1: formData.profil.noHpPIC1,
                no_hp_pic2: formData.profil.noHpPIC2,

                // Keuangan (Step 4)
                nomor_rekening: formData.keuangan.nomorRekening,
                nama_pemilik_rekening: formData.keuangan.namaPemilik,
                kode_cabang: formData.keuangan.kodeCabang,
                tipe_rekening: formData.keuangan.tipeRekening,
                status_kepemilikan: formData.keuangan.statusKepemilikan,

                // Transaksi (Step 5)
                sales_volume_per_tahun: parseInt((formData.dataTransaksi.salesVolumePerTahun || '').replace(/[^0-9]/g, '')) || 0,
                komitmen_sales_volume: parseInt((formData.dataTransaksi.komitmenSalesVolume || '').replace(/[^0-9]/g, '')) || 0,
                rata_rata_nominal: parseInt((formData.dataTransaksi.rataRataNominal || '').replace(/[^0-9]/g, '')) || 0,
                komitmen_saldo_mengendap: parseInt((formData.dataTransaksi.komitmenSaldoMengendap || '').replace(/[^0-9]/g, '')) || 0,
                frekuensi_harian: parseInt(formData.dataTransaksi.frekuensiHarian) || 0,

                // Konfigurasi (Step 6)
                kode_cabang_akusisi: formData.konfigurasi.kodeCabangAkusisi,
                kode_cabang_lokasi: formData.konfigurasi.kodeCabangLokasi,
                kode_mcc: formData.konfigurasi.kodeMCC,
                kategori_usaha: formData.konfigurasi.kategoriUsaha,
                mdr: formData.konfigurasi.mdr,
                jadwal_settlement: formData.konfigurasi.jadwalSettlement,
                jumlah_edc: parseInt(formData.konfigurasi.jumlahEDC) || 0,
                bank_edc_lain: formData.konfigurasi.bankEDCLain,
                biaya_admin_edc: parseInt((formData.konfigurasi.biayaAdminEDC || '').replace(/[^0-9]/g, '')) || 0,

                // Metadata
                status: 'pending',
                submitted_at: new Date().toISOString()
            }
        };

        // Re-construct the flat object for Supabase insert just like before
        // Since our thunk expects the flat object directly for insert
        const merchantData = payload.merchant_data;

        return merchantData;
    };

    const handleSubmit = async () => {
        setShowConfirmModal(false);
        const apiPayload = constructPayload();
        dispatch(submitApplication(apiPayload));
    };

    const handleSuccessClose = () => {
        setShowSuccessModal(false);
        dispatch(resetSubmission());
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
                        disabled={status === 'loading'}
                    >
                        {status === 'loading' ? 'Menyimpan...' : (currentStep === 7 ? 'Simpan dan Daftar' : 'Simpan dan Lanjut')}
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
