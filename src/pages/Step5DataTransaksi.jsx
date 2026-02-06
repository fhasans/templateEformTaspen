import React from 'react';
import FormSection from '../components/FormSection';
import Input from '../components/Input';

const Step5DataTransaksi = () => {
    return (
        <FormSection title="Data Transaksi">
            {/* Row 1: 2 Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <Input
                    label="Sales Volume per Tahun"
                    required={true}
                    placeholder="1.200.000.000"
                />
                <Input
                    label="Komitmen Sales Volume (Bulanan)"
                    placeholder="120.000.000"
                />
            </div>

            {/* Row 2: 3 Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input
                    label="Rata-rata Nominal per Transaksi"
                    placeholder="250.000"
                />
                <Input
                    label="Komitmen Saldo Mengendap"
                    placeholder="50.000.000"
                />
                <Input
                    label="Estimasi Frekuensi Transaksi"
                    placeholder="400"
                    type="number"
                />
            </div>
        </FormSection>
    );
};

export default Step5DataTransaksi;
