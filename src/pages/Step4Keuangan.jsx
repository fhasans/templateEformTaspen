import React, { useState } from 'react';
import FormSection from '../components/FormSection';
import Input from '../components/Input';
import Select from '../components/Select';

const Step4Keuangan = ({ data = {}, updateData, errors = {} }) => {
    // Local state for checking status
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Dummy data for simulation
    const DUMMY_ACCOUNTS = {
        '1234567890': {
            nama: 'Budi Santoso',
            cabang: 'MANTAP JAKARTA',
            tipe: 'Tabungan'
        },
        '0987654321': {
            nama: 'PT. Maju Mundur',
            cabang: 'MANTAP SURABAYA',
            tipe: 'Giro'
        }
    };

    const handleInputChange = (field, value) => {
        updateData({ [field]: value });
        // Clear error when user types new account number
        if (field === 'nomorRekening') {
            setError(null);
            // Reset fetched fields if account number changes? Maybe.
            // For now let's keep it simple.
        }
    };

    const handleCekRekening = () => {
        const accNum = data.nomorRekening;

        if (!accNum) {
            setError("Nomor rekening harus diisi");
            return;
        }

        setIsLoading(true);
        setError(null);

        // Simulate API call
        setTimeout(() => {
            const account = DUMMY_ACCOUNTS[accNum];

            if (account) {
                updateData({
                    namaPemilik: account.nama,
                    kodeCabang: account.cabang,
                    tipeRekening: account.tipe
                });
            } else {
                setError("Rekening tidak terdaftar. Silakan periksa kembali.");
                // Optional: Clear fields if not found
                updateData({
                    namaPemilik: '',
                    kodeCabang: '',
                    tipeRekening: ''
                });
            }
            setIsLoading(false);
        }, 1500);
    };

    return (
        <FormSection title="Data Rekening Pencairan">
            <div className="mb-4">
                <Input
                    label="Bank Tujuan"
                    value="Bank Mandiri Taspen"
                    readOnly={true}
                    className="bg-gray-100"
                />
            </div>

            <div className="flex flex-col md:flex-row gap-3 items-end mb-4">
                <div className="flex-1 min-w-0">
                    <Input
                        label="Nomor Rekening"
                        required={true}
                        placeholder="1234567890"
                        type="text"
                        value={data.nomorRekening || ''}
                        onChange={(e) => {
                            // Only allow numbers
                            const val = e.target.value.replace(/[^0-9]/g, '');
                            handleInputChange('nomorRekening', val);
                        }}
                    />
                    {error && <p className="text-red-500 text-sm -mt-3">{error}</p>}
                </div>
                <button
                    onClick={handleCekRekening}
                    disabled={isLoading}
                    className={`text-white px-6 py-2 rounded shadow transition-colors font-semibold border border-transparent whitespace-nowrap h-[42px] ${error ? 'mb-6' : 'mb-4'} flex-shrink-0 ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#1e3a8a] hover:bg-blue-800'}`}
                >
                    {isLoading ? 'Memeriksa...' : 'Cek Rekening'}
                </button>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <Input
                        label="Nama Pemilik Rekening"
                        placeholder=""
                        readOnly={true}
                        className="bg-gray-100"
                        value={data.namaPemilik || ''}
                    />
                    {errors.namaPemilikRekening && <p className="text-red-500 text-sm -mt-3 mb-3">{errors.namaPemilikRekening}</p>}
                    <Input
                        label="Kode Cabang Rekening"
                        placeholder=""
                        readOnly={true}
                        className="bg-gray-100"
                        value={data.kodeCabang || ''}
                    />
                    {errors.kodeCabangRekening && <p className="text-red-500 text-sm -mt-3 mb-3">{errors.kodeCabangRekening}</p>}
                </div>
                <div>
                    <Input
                        label="Tipe Rekening"
                        placeholder=""
                        readOnly={true}
                        className="bg-gray-100"
                        value={data.tipeRekening || ''}
                    />
                    {errors.tipeRekening && <p className="text-red-500 text-sm -mt-3 mb-3">{errors.tipeRekening}</p>}
                    <Select
                        label="Status Kepemilikan"
                        required={true}
                        options={[
                            { value: "", label: "Pilih Status" },
                            { value: "sendiri", label: "Milik Sendiri" },
                            { value: "perusahaan", label: "Milik Perusahaan" },
                        ]}
                        value={data.statusKepemilikan || ''}
                        onChange={(e) => handleInputChange('statusKepemilikan', e.target.value)}
                        error={errors.statusKepemilikan}
                    />
                </div>
            </div>
        </FormSection>
    );
};

export default Step4Keuangan;
