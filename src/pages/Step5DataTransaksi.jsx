import React from 'react';
import FormSection from '../components/FormSection';
import Input from '../components/Input';

const Step5DataTransaksi = ({ data = {}, updateData, errors = {} }) => {
    const handleChange = (field, value) => {
        updateData({ [field]: value });
    };

    return (
        <FormSection title="Data Transaksi">
            {/* Row 1: 2 Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <Input
                    label="Sales Volume per Tahun"
                    required={true}
                    placeholder="1.200.000.000"
                    value={data.salesVolumePerTahun || ''}
                    onChange={(e) => handleChange('salesVolumePerTahun', e.target.value)}
                    error={errors.salesVolumePerTahun}
                />
                <Input
                    label="Komitmen Sales Volume (Bulanan)"
                    placeholder="120.000.000"
                    value={data.komitmenSalesVolume || ''}
                    onChange={(e) => handleChange('komitmenSalesVolume', e.target.value)}
                />
            </div>

            {/* Row 2: 3 Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input
                    label="Rata-rata Nominal per Transaksi"
                    placeholder="250.000"
                    value={data.rataRataNominal || ''}
                    onChange={(e) => handleChange('rataRataNominal', e.target.value)}
                />
                <Input
                    label="Komitmen Saldo Mengendap"
                    placeholder="50.000.000"
                    value={data.komitmenSaldoMengendap || ''}
                    onChange={(e) => handleChange('komitmenSaldoMengendap', e.target.value)}
                />
                <Input
                    label="Estimasi Frekuensi Transaksi"
                    placeholder="400"
                    type="number"
                    value={data.estimasiFrekuensi || ''}
                    onChange={(e) => handleChange('estimasiFrekuensi', e.target.value)}
                />
            </div>
        </FormSection>
    );
};

export default Step5DataTransaksi;
