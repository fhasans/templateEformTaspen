import React, { useState } from 'react';
import FormSection from '../components/FormSection';
import Input from '../components/Input';
import Select from '../components/Select';

const Step6Konfigurasi = () => {
    const [showEDC, setShowEDC] = useState(false);

    return (
        <FormSection title="Konfigurasi Teknis">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <Select
                    label="Kode Cabang Akuisisi (Konsol)"
                    required={true}
                    options={[
                        { value: "1201", label: "1201 - KC JAKARTA" },
                    ]}
                    defaultValue="1201"
                />
                <Select
                    label="Kode Cabang Lokasi (Unit)"
                    required={true}
                    options={[
                        { value: "1201", label: "1201 - KC JAKARTA" },
                    ]}
                    defaultValue="1201"
                />
            </div>

            <div className="mb-4">
                <Select
                    label="Kode MCC"
                    required={true}
                    options={[
                        { value: "5310", label: "5310 (autofill) TBC" },
                    ]}
                    defaultValue="5310"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <Select
                    label="Kategori Usaha"
                    required={true}
                    options={[
                        { value: "UME", label: "UME" },
                    ]}
                    defaultValue="UME"
                />
                <Input
                    label="MDR"
                    required={true}
                    defaultValue="0.7%"
                    disabled={true}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Input
                    label="Jadwal Settlement"
                    required={true}
                    placeholder="H+1"
                />
                <Input
                    label="Jumlah Terminal/Kasir (QRIS Statis)"
                    required={true}
                    placeholder="1"
                    type="number"
                />
            </div>

            {/* Toggle for Conditional Fields */}
            <div className="mb-6">
                <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={showEDC}
                        onChange={(e) => setShowEDC(e.target.checked)}
                        className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-gray-900 font-semibold">Ajukan Mesin EDC</span>
                </label>
            </div>

            {/* Conditional Fields */}
            {showEDC && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                        <Input
                            label="Jumlah Mesin EDC"
                            placeholder="2"
                            type="number"
                        />
                        <Input
                            label="Mesin EDC Bank Lain Yang Dimiliki"
                            placeholder="BCA, BRI"
                        />
                    </div>
                    <div className="mb-4">
                        <Input
                            label="Biaya Administrasi EDC (per bulan)"
                            required={true}
                            placeholder="25.000"
                            type="number"
                        />
                    </div>
                </>
            )}
        </FormSection>
    );
};

export default Step6Konfigurasi;
