import React from 'react';
import FormSection from '../components/FormSection';
import Input from '../components/Input';
import Select from '../components/Select';

const RadioGroup = ({ label, name, options, required, className }) => (
    <div className={`mb-4 ${className}`}>
        <label className="block text-gray-900 font-bold mb-2 text-sm">
            {label} {required && <span className="text-red-600">*</span>}
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {options.map((option) => (
                <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                    <input
                        type="radio"
                        name={name}
                        value={option.value}
                        className="form-radio h-5 w-5 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700 text-sm whitespace-nowrap">{option.label}</span>
                </label>
            ))}
        </div>
    </div>
);

const RadioGroupGrid = ({ label, name, options, required }) => (
    <div className="mb-4">
        <label className="block text-gray-900 font-bold mb-2 text-sm">
            {label} {required && <span className="text-red-600">*</span>}
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-3 gap-x-4">
            {options.map((option) => (
                <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                    <input
                        type="radio"
                        name={name}
                        value={option.value}
                        className="form-radio h-5 w-5 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700 text-sm">{option.label}</span>
                </label>
            ))}
            <div className="flex items-center space-x-2 col-span-2">
                <input
                    type="radio"
                    name={name}
                    value="lainnya"
                    className="form-radio h-5 w-5 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700 text-sm mr-2">Lainnya:</span>
                <input type="text" className="flex-grow px-2 py-1 border border-gray-300 rounded text-sm" />
            </div>
        </div>
    </div>
);


const Step2DataUsaha = () => {
    return (
        <div>
            {/* Informasi Merchant */}
            <FormSection title="Informasi Merchant">
                <div className="mb-4">
                    <Select
                        label="Jenis Usaha"
                        required={true}
                        options={[
                            { value: 'rumah_makan', label: 'Rumah Makan' },
                            { value: 'toko_kelontong', label: 'Toko Kelontong' },
                        ]}
                        defaultValue="rumah_makan"
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <Input
                        label="Nama Merchant (Official)"
                        placeholder="PT Maju Jaya Sejahtera"
                    />
                    <Input
                        label="Nama Merchant di QR (Sticker)"
                        required={true}
                        placeholder="Rumah Makan Maju Jaya Sejahtera"
                        subtext="" // Can add info icon if needed
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <Input
                        label="Email Merchant (Notifikasi)"
                        required={true}
                        placeholder="admin@majujayasejahtera.co.id"
                    />
                    <Input
                        label="Email Merchant (MSR)"
                        required={true}
                        placeholder="admin@majujayasejahtera.co.id"
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <Input
                        label="No. Telepon Usaha / Merchant"
                        required={true}
                        placeholder="02188997766"
                    />
                    <Input
                        label="Link Website / Sosial Media"
                        placeholder="https://instagram.com/majujaya.id"
                    />
                </div>
            </FormSection>

            {/* Alamat */}
            <FormSection title="Alamat">
                <Input
                    label="Alamat"
                    required={true}
                    placeholder="Jl. Gatot Subroto Kav. 18"
                    className="mb-4"
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                    <Select
                        label="Provinsi"
                        required={true}
                        options={[
                            { value: 'dki_jakarta', label: 'DKI Jakarta' },
                        ]}
                        defaultValue="dki_jakarta"
                    />
                    <Select
                        label="Kab/Kota"
                        required={true}
                        options={[
                            { value: 'jakarta_selatan', label: 'Kota Jakarta Selatan' },
                        ]}
                        defaultValue="jakarta_selatan"
                    />
                    <Select
                        label="Kecamatan"
                        required={true}
                        options={[
                            { value: 'setiabudi', label: 'Setiabudi' },
                        ]}
                        defaultValue="setiabudi"
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Select
                        label="Kelurahan/Desa"
                        required={true}
                        options={[
                            { value: 'karet_semanggi', label: 'Karet Semanggi' },
                        ]}
                        defaultValue="karet_semanggi"
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="RT"
                            required={true}
                            placeholder="002"
                        />
                        <Input
                            label="RW"
                            required={true}
                            placeholder="005"
                        />
                    </div>
                    <Select
                        label="Kode Pos"
                        required={true}
                        options={[
                            { value: '12930', label: '12930' },
                        ]}
                        defaultValue="12930"
                    />
                </div>
            </FormSection>

            {/* Legal & Bentuk Usaha */}
            <FormSection title="Legal & Bentuk Usaha">
                <Select
                    label="Bentuk Usaha"
                    required={true}
                    options={[
                        { value: 'perorangan', label: 'Perorangan' },
                        { value: 'pt', label: 'PT' },
                        { value: 'cv', label: 'CV' },
                    ]}
                    defaultValue="perorangan"
                />
            </FormSection>

            {/* Profil Usaha */}
            <FormSection title="Profil Usaha">
                <div className="mb-4">
                    <Input
                        label="Bidang Usaha"
                        placeholder="Perdagangan Ritel"
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <Select
                        label="Tipe Bisnis"
                        required={true}
                        options={[
                            { value: 'retail', label: 'Retail' },
                        ]}
                        defaultValue="retail"
                    />
                    <Input
                        label="Luas Tempat Usaha (m2)"
                        placeholder="45"
                    />
                </div>
                <RadioGroupGrid
                    label="Lingkungan Usaha"
                    name="lingkunganUsaha"
                    required={true}
                    options={[
                        { value: 'wisata', label: 'Daerah Wisata' },
                        { value: 'pemukiman', label: 'Pemukiman' },
                        { value: 'pusat_belanja', label: 'Pusat Belanja' },
                        { value: 'perkantoran', label: 'Perkantoran' },
                        { value: 'pertokoan', label: 'Pertokoan' },
                        { value: 'pkl', label: 'PKL/Gerobak/Tenda (Non-Permanent Store)' },
                    ]}
                />
                <RadioGroup
                    label="Status Tempat"
                    name="statusTempat"
                    required={true}
                    options={[
                        { value: 'milik_sendiri', label: 'Milik Sendiri' },
                        { value: 'sewa', label: 'Sewa' },
                    ]}
                />
            </FormSection>

            {/* Operasional Usaha */}
            <FormSection title="Operasional Usaha">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                        label="Tanggal Berdiri"
                        type="date"
                        defaultValue="2020-06-15"
                    />
                    <div className="flex gap-4">
                        <div className="flex-grow">
                            <label className="block text-gray-900 font-bold mb-2 text-sm">Jam Operasional</label>
                            <div className="flex items-center gap-2">
                                <select className="w-full px-3 py-2 border border-gray-300 rounded text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500">
                                    <option>10:00</option>
                                </select>
                                <span>-</span>
                                <select className="w-full px-3 py-2 border border-gray-300 rounded text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500">
                                    <option>22:00</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex-grow">
                            <Input
                                label="Jumlah Karyawan"
                                placeholder="12"
                                type="number"
                            />
                        </div>
                    </div>
                </div>
            </FormSection>
        </div>
    );
};

export default Step2DataUsaha;
