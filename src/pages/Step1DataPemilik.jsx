import React from 'react';
import FormSection from '../components/FormSection';
import Input from '../components/Input';
import Select from '../components/Select';

const RadioGroup = ({ label, name, options, required, value, onChange, error }) => (
    <div className="mb-6">
        <label className="block text-gray-900 font-bold mb-2 text-sm">
            {label} {required && <span className="text-red-600">*</span>}
        </label>
        <div className="flex gap-6">
            {options.map((option) => (
                <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                    <input
                        type="radio"
                        name={name}
                        value={option.value}
                        checked={value === option.value}
                        onChange={(e) => onChange(e.target.value)}
                        className="form-radio h-5 w-5 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">{option.label}</span>
                </label>
            ))}
        </div>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
);

const Step1DataPemilik = ({ data = {}, updateData, errors = {} }) => {

    const handleChange = (field, value) => {
        updateData({ [field]: value });
    };

    // Initialize defaults for fields that have visual defaults
    React.useEffect(() => {
        const defaults = {
            provinsi: 'dki_jakarta',
            kabKota: 'jakarta_barat',
            kecamatan: 'kebon_jeruk',
            kelurahan: 'kebon_jeruk',
            kodePos: '11530',
            // Also Initialize optional fields that appear selected if needed, 
            // but strict validation only cares about required ones.
            // jenisIdentitas defaults to 'ktp' visually but is not mandatory in validation.js? 
            // actually logic says mandatory: no.
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
    }, []); // Run once on mount


    return (
        <div>
            {/* Pre-Formulir Section */}
            <FormSection title="Pre-Formulir">
                <RadioGroup
                    label="Tipe Nasabah"
                    name="tipeNasabah"
                    required
                    options={[
                        { value: 'perorangan', label: 'Perorangan' },
                        { value: 'badan_usaha', label: 'Badan Usaha' },
                    ]}
                    value={data.tipeNasabah || ''}
                    onChange={(val) => handleChange('tipeNasabah', val)}
                    error={errors.tipeNasabah}
                />
                <RadioGroup
                    label="Tipe Layanan QRIS"
                    name="tipeLayananQRIS"
                    required
                    options={[
                        { value: 'statis', label: 'QRIS Statis' },
                        { value: 'dinamis', label: 'QRIS Dinamis' },
                    ]}
                    value={data.tipeLayananQRIS || ''}
                    onChange={(val) => handleChange('tipeLayananQRIS', val)}
                    error={errors.tipeLayananQRIS}
                />

                {/* Kode Sales Field (New per Workflow) */}
                <div className="mt-4">
                    <Input
                        label="Kode Sales (Opsional)"
                        placeholder="Contoh: S12345"
                        value={data.kodeSales || ''}
                        onChange={(e) => handleChange('kodeSales', e.target.value)}
                        error={errors.kodeSales}
                    />
                </div>
            </FormSection>

            {/* Data Pemilik Section */}
            <FormSection title="Data Pemilik">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <Select
                        label="Jenis Identitas"
                        options={[
                            { value: 'ktp', label: 'KTP' },
                            { value: 'sim', label: 'SIM' },
                            { value: 'passport', label: 'Passport' },
                        ]}
                        value={data.jenisIdentitas || ''}
                        onChange={(e) => handleChange('jenisIdentitas', e.target.value)}
                        error={errors.jenisIdentitas}
                    />
                    <Input
                        label="Nomor Identitas"
                        required={true}
                        placeholder="3175091203980004"
                        value={data.nomorIdentitas || ''}
                        onChange={(e) => handleChange('nomorIdentitas', e.target.value)}
                        error={errors.nomorIdentitas}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <Input
                        label="Nama Pemilik/Pengurus"
                        required={true}
                        placeholder="Andi Pratama"
                        subtext="Wajib sesuai kartu identitas"
                        value={data.namaPemilik || ''}
                        onChange={(e) => handleChange('namaPemilik', e.target.value)}
                        error={errors.namaPemilik}
                    />
                    <Input
                        label="No HP Pemilik/Pengurus"
                        required={true}
                        placeholder="081234567890"
                        value={data.noHpPemilik || ''}
                        onChange={(e) => handleChange('noHpPemilik', e.target.value)}
                        error={errors.noHpPemilik}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                        label="NPWP Pemilik"
                        required={data.tipeNasabah === 'badan_usaha'}
                        placeholder=""
                        value={data.npwpPemilik || ''}
                        onChange={(e) => handleChange('npwpPemilik', e.target.value)}
                        error={errors.npwpPemilik}
                    />
                </div>
            </FormSection>

            {/* Alamat Section */}
            <FormSection title="Alamat">
                <Input
                    label="Alamat"
                    required={true}
                    placeholder="Jl. Melati Raya Blok B No. 12"
                    className="mb-4"
                    value={data.alamat || ''}
                    onChange={(e) => handleChange('alamat', e.target.value)}
                    error={errors.alamat}
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                    <Select
                        label="Provinsi"
                        required={true}
                        options={[
                            { value: 'dki_jakarta', label: 'DKI Jakarta' },
                        ]}
                        value={data.provinsi || 'dki_jakarta'}
                        onChange={(e) => handleChange('provinsi', e.target.value)}
                        error={errors.provinsi}
                    />
                    <Select
                        label="Kab/Kota"
                        required={true}
                        options={[
                            { value: 'jakarta_barat', label: 'Kota Jakarta Barat' },
                        ]}
                        value={data.kabKota || 'jakarta_barat'}
                        onChange={(e) => handleChange('kabKota', e.target.value)}
                        error={errors.kabKota}
                    />
                    <Select
                        label="Kecamatan"
                        required={true}
                        options={[
                            { value: 'kebon_jeruk', label: 'Kebon Jeruk' },
                        ]}
                        value={data.kecamatan || 'kebon_jeruk'}
                        onChange={(e) => handleChange('kecamatan', e.target.value)}
                        error={errors.kecamatan}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Select
                        label="Kelurahan/Desa"
                        required={true}
                        options={[
                            { value: 'kebon_jeruk', label: 'Kebon Jeruk' },
                        ]}
                        value={data.kelurahan || 'kebon_jeruk'}
                        onChange={(e) => handleChange('kelurahan', e.target.value)}
                        error={errors.kelurahan}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="RT"
                            required={true}
                            placeholder="004"
                            value={data.rt || ''}
                            onChange={(e) => handleChange('rt', e.target.value)}
                            error={errors.rt}
                        />
                        <Input
                            label="RW"
                            required={true}
                            placeholder="006"
                            value={data.rw || ''}
                            onChange={(e) => handleChange('rw', e.target.value)}
                            error={errors.rw}
                        />
                    </div>
                    <Select
                        label="Kode Pos"
                        required={true}
                        options={[
                            { value: '11530', label: '11530' },
                        ]}
                        value={data.kodePos || '11530'}
                        onChange={(e) => handleChange('kodePos', e.target.value)}
                        error={errors.kodePos}
                    />
                </div>
            </FormSection>
        </div>
    );
};

export default Step1DataPemilik;
