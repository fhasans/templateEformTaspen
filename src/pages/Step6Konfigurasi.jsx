import React, { useState, useEffect } from 'react';
import FormSection from '../components/FormSection';
import Input from '../components/Input';
import Select from '../components/Select';
import { formatCurrency, parseCurrency } from '../utils/currencyFormatter';

const Step6Konfigurasi = ({ data = {}, updateData, dataPemilik = {}, errors = {} }) => {

    // Check if QRIS Dinamis is selected in Step 1
    const isQrisDinamis = dataPemilik.tipeLayananQRIS === 'dinamis';

    const handleChange = (field, value) => {
        // For currency fields, parse the formatted value to store raw numbers
        // Check if this is the biayaAdminEDC field (currency field)
        if (field === 'biayaAdminEDC') {
            const rawValue = parseCurrency(value);
            updateData({ [field]: rawValue });
        } else {
            updateData({ [field]: value });
        }
    };

    // Initialize defaults
    useEffect(() => {
        const defaults = {
            kodeCabangAkusisi: '1201',
            kodeCabangLokasi: '1201',
            kodeMCC: '5310',
            kategoriUsaha: 'UME',
            mdr: '0.7%'
        };

        const updates = {};
        Object.keys(defaults).forEach(key => {
            if (!data[key]) {
                updates[key] = defaults[key];
            }
        });

        if (Object.keys(updates).length > 0) {
            updateData(updates);
        }
    }, []);

    return (
        <FormSection title="Konfigurasi Teknis">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <Select
                    label="Kode Cabang Akuisisi (Konsol)"
                    required={true}
                    options={[
                        { value: "1201", label: "1201 - KC JAKARTA" },
                    ]}
                    value={data.kodeCabangAkusisi || '1201'}
                    onChange={(e) => handleChange('kodeCabangAkusisi', e.target.value)}
                    error={errors.kodeCabangAkusisi}
                />
                <Select
                    label="Kode Cabang Lokasi (Unit)"
                    required={true}
                    options={[
                        { value: "1201", label: "1201 - KC JAKARTA" },
                    ]}
                    value={data.kodeCabangLokasi || '1201'}
                    onChange={(e) => handleChange('kodeCabangLokasi', e.target.value)}
                    error={errors.kodeCabangLokasi}
                />
            </div>

            <div className="mb-4">
                <Select
                    label="Kode MCC"
                    required={true}
                    options={[
                        { value: "5310", label: "5310 (autofill) TBC" },
                    ]}
                    value={data.kodeMCC || '5310'}
                    onChange={(e) => handleChange('kodeMCC', e.target.value)}
                    error={errors.kodeMCC}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <Select
                    label="Kategori Usaha"
                    required={true}
                    options={[
                        { value: "UME", label: "UME" },
                    ]}
                    value={data.kategoriUsaha || 'UME'}
                    onChange={(e) => handleChange('kategoriUsaha', e.target.value)}
                    error={errors.kategoriUsaha}
                />
                <Input
                    label="MDR"
                    required={true}
                    defaultValue="0.7%"
                    disabled={true}
                    value={data.mdr || '0.7%'}
                    onChange={(e) => handleChange('mdr', e.target.value)} // Even if disabled, binding is good
                    error={errors.mdr}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Input
                    label="Jadwal Settlement"
                    required={true}
                    placeholder="H+1"
                    value={data.jadwalSettlement || ''}
                    onChange={(e) => handleChange('jadwalSettlement', e.target.value)}
                    error={errors.jadwalSettlement}
                />
                <Input
                    label="Jumlah Terminal/Kasir (QRIS Statis)"
                    required={true}
                    placeholder="1"
                    type="number"
                    value={data.jumlahTerminal || ''}
                    onChange={(e) => handleChange('jumlahTerminal', e.target.value)}
                />
            </div>

            {/* Conditional Fields based on dataPemilik.tipeLayananQRIS */}
            {isQrisDinamis && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                        <Input
                            label="Jumlah Mesin EDC"
                            placeholder="2"
                            type="number"
                            value={data.jumlahMesinEDC || ''}
                            onChange={(e) => handleChange('jumlahMesinEDC', e.target.value)}
                        />
                        <Input
                            label="Mesin EDC Bank Lain Yang Dimiliki"
                            placeholder="BCA, BRI"
                            value={data.mesinEDCLain || ''}
                            onChange={(e) => handleChange('mesinEDCLain', e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <Input
                            label="Biaya Administrasi EDC (per bulan)"
                            required={true}
                            placeholder="25.000"
                            type="text"
                            value={formatCurrency(data.biayaAdminEDC || '')}
                            onChange={(e) => handleChange('biayaAdminEDC', e.target.value)}
                            error={errors.biayaAdminEDC}
                        />
                    </div>
                </>
            )}
        </FormSection>
    );
};

export default Step6Konfigurasi;
