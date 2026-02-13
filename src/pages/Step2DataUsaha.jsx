import React from 'react';
import FormSection from '../components/FormSection';
import Input from '../components/Input';
import Select from '../components/Select';

const RadioGroup = ({ label, name, options, required, value, onChange, className }) => (
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
                        checked={value === option.value}
                        onChange={(e) => onChange(e.target.value)}
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


const Step2DataUsaha = ({ data = {}, updateData, errors = {} }) => {

    const handleChange = (field, value) => {
        updateData({ [field]: value });
    };

    // Initialize defaults based on FSD logic
    React.useEffect(() => {
        const defaults = {
            jenisUsaha: 'rumah_makan',
            provinsiUsaha: 'dki_jakarta',
            kabKotaUsaha: 'jakarta_selatan',
            kecamatanUsaha: 'setiabudi',
            kelurahanUsaha: 'karet_semanggi',
            kodePosUsaha: '12930',
            // bentukUsaha logic is handled in subsequent effect, but default safe value:
            bentukUsaha: data.tipeNasabah === 'perorangan' ? 'perorangan' : 'pt',
            tipeBisnis: 'retail'
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

    // Effect to enforce "Bentuk Usaha" based on "Tipe Nasabah"
    React.useEffect(() => {
        if (data.tipeNasabah === 'perorangan') {
            if (data.bentukUsaha !== 'perorangan') {
                updateData({ bentukUsaha: 'perorangan' });
            }
        }
    }, [data.tipeNasabah]);

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
                        value={data.jenisUsaha || ''}
                        onChange={(e) => handleChange('jenisUsaha', e.target.value)}
                        error={errors.jenisUsaha}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <Input
                        label="Nama Merchant (Official)"
                        placeholder="PT Maju Jaya Sejahtera"
                        required={data.tipeNasabah === 'badan_usaha'} // Mandatory for Badan Usaha
                        value={data.namaMerchantOfficial || ''}
                        onChange={(e) => handleChange('namaMerchantOfficial', e.target.value)}
                        error={errors.namaMerchantOfficial}
                    />
                    <div>
                        <Input
                            label="Nama Merchant di QR (Sticker)"
                            required={true}
                            placeholder="Rumah Makan Maju Jaya Sejahtera"
                            value={data.namaMerchantQR || ''}
                            onChange={(e) => handleChange('namaMerchantQR', e.target.value)}
                            error={errors.namaMerchantQR}
                        />
                        {/* Suggest Keywords */}
                        <div className="mt-2 text-sm text-gray-600 flex gap-2 items-center flex-wrap">
                            <span className="font-semibold text-green-600 italic">suggest:</span>
                            {['Warung', 'Restaurant', 'Rumah Makan'].map(keyword => (
                                <button
                                    key={keyword}
                                    type="button"
                                    onClick={() => handleChange('namaMerchantQR', keyword + ' ')}
                                    className="bg-gray-100 hover:bg-gray-200 px-2 py-0.5 rounded border border-gray-300 transition-colors"
                                >
                                    {keyword}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <Input
                        label="Email Merchant (Notifikasi)"
                        required={true}
                        placeholder="admin@majujayasejahtera.co.id"
                        value={data.emailNotifikasi || ''}
                        onChange={(e) => handleChange('emailNotifikasi', e.target.value)}
                        error={errors.emailNotifikasi}
                    />
                    <Input
                        label="Email Merchant (MSR)"
                        required={true}
                        placeholder="admin@majujayasejahtera.co.id"
                        value={data.emailMSR || ''}
                        onChange={(e) => handleChange('emailMSR', e.target.value)}
                        error={errors.emailMSR}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <Input
                        label="No. Telepon Usaha / Merchant"
                        required={true}
                        placeholder="02188997766"
                        type="tel"
                        value={data.noTelponUsaha || ''}
                        onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9]/g, '');
                            handleChange('noTelponUsaha', val)
                        }}
                        error={errors.noTelponUsaha}
                    />
                    <Input
                        label="Link Website / Sosial Media"
                        placeholder="https://instagram.com/majujaya.id"
                        value={data.website || ''}
                        onChange={(e) => handleChange('website', e.target.value)}
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
                    value={data.alamatUsaha || ''}
                    onChange={(e) => handleChange('alamatUsaha', e.target.value)}
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                    <Select
                        label="Provinsi"
                        required={true}
                        options={[
                            { value: 'dki_jakarta', label: 'DKI Jakarta' },
                        ]}
                        value={data.provinsiUsaha || 'dki_jakarta'}
                        onChange={(e) => handleChange('provinsiUsaha', e.target.value)}
                    />
                    <Select
                        label="Kab/Kota"
                        required={true}
                        options={[
                            { value: 'jakarta_selatan', label: 'Kota Jakarta Selatan' },
                        ]}
                        value={data.kabKotaUsaha || 'jakarta_selatan'}
                        onChange={(e) => handleChange('kabKotaUsaha', e.target.value)}
                    />
                    <Select
                        label="Kecamatan"
                        required={true}
                        options={[
                            { value: 'setiabudi', label: 'Setiabudi' },
                        ]}
                        value={data.kecamatanUsaha || 'setiabudi'}
                        onChange={(e) => handleChange('kecamatanUsaha', e.target.value)}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Select
                        label="Kelurahan/Desa"
                        required={true}
                        options={[
                            { value: 'karet_semanggi', label: 'Karet Semanggi' },
                        ]}
                        value={data.kelurahanUsaha || 'karet_semanggi'}
                        onChange={(e) => handleChange('kelurahanUsaha', e.target.value)}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="RT"
                            required={true}
                            placeholder="002"
                            value={data.rtUsaha || ''}
                            onChange={(e) => handleChange('rtUsaha', e.target.value)}
                        />
                        <Input
                            label="RW"
                            required={true}
                            placeholder="005"
                            value={data.rwUsaha || ''}
                            onChange={(e) => handleChange('rwUsaha', e.target.value)}
                        />
                    </div>
                    <Select
                        label="Kode Pos"
                        required={true}
                        options={[
                            { value: '12930', label: '12930' },
                        ]}
                        value={data.kodePosUsaha || '12930'}
                        onChange={(e) => handleChange('kodePosUsaha', e.target.value)}
                    />
                </div>
            </FormSection>

            {/* Legal & Bentuk Usaha */}
            <FormSection title="Legal & Bentuk Usaha">
                {data.tipeNasabah === 'perorangan' ? (
                    <Input
                        label="Bentuk Usaha"
                        required={true}
                        value="Perorangan"
                        readOnly={true} // Readonly for perorangan
                        className="bg-gray-100"
                    />
                ) : (
                    <Select
                        label="Bentuk Usaha"
                        required={true}
                        options={[
                            { value: 'pt', label: 'PT' },
                            { value: 'cv', label: 'CV' },
                            { value: 'yayasan', label: 'Yayasan' },
                            { value: 'koperasi', label: 'Koperasi' },
                            { value: 'pameran', label: 'Pameran' },
                            { value: 'lainnya', label: 'Lainnya' },
                        ]}
                        value={data.bentukUsaha || ''}
                        onChange={(e) => handleChange('bentukUsaha', e.target.value)}
                        error={errors.bentukUsaha}
                    />
                )}

                {/* Conditional Pameran Dates */}
                {(data.bentukUsaha === 'pameran' && data.tipeNasabah !== 'perorangan') && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        <Input
                            label="Jadwal Pameran Awal"
                            type="date"
                            required={true}
                            value={data.pameran_start || ''}
                            onChange={(e) => handleChange('pameran_start', e.target.value)}
                            error={errors.pameran_start} // Validation needed
                        />
                        <Input
                            label="Jadwal Pameran Akhir"
                            type="date"
                            required={true}
                            value={data.pameran_end || ''}
                            onChange={(e) => handleChange('pameran_end', e.target.value)}
                            error={errors.pameran_end} // Validation needed
                        />
                    </div>
                )}
                {/* Conditional Lainnya Input */}
                {(data.bentukUsaha === 'lainnya' && data.tipeNasabah !== 'perorangan') && (
                    <div className="mt-4">
                        <Input
                            label="Bentuk Usaha (Lainnya)"
                            required={true}
                            placeholder="Sebutkan bentuk usaha..."
                            value={data.bentukUsahaLainnya || ''}
                            onChange={(e) => handleChange('bentukUsahaLainnya', e.target.value)}
                        // error={errors.bentukUsahaLainnya} -> Validasi perlu tambah
                        />
                    </div>
                )}
            </FormSection>

            {/* Profil Usaha */}
            <FormSection title="Profil Usaha">
                <div className="mb-4">
                    <Input
                        label="Bidang Usaha"
                        placeholder="Perdagangan Ritel"
                        value={data.bidangUsaha || ''}
                        onChange={(e) => handleChange('bidangUsaha', e.target.value)}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <Select
                        label="Tipe Bisnis"
                        required={true}
                        options={[
                            { value: 'retail', label: 'Retail' },
                        ]}
                        value={data.tipeBisnis || 'retail'}
                        onChange={(e) => handleChange('tipeBisnis', e.target.value)}
                    />
                    <Input
                        label="Luas Tempat Usaha (m2)"
                        placeholder="45"
                        type="number"
                        value={data.luasTempatUsaha || ''}
                        onChange={(e) => handleChange('luasTempatUsaha', e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-900 font-bold mb-2 text-sm">
                        Lingkungan Usaha {true && <span className="text-red-600">*</span>}
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-y-3 gap-x-4">
                        {[
                            { value: 'wisata', label: 'Daerah Wisata' },
                            { value: 'pemukiman', label: 'Pemukiman' },
                            { value: 'pusat_belanja', label: 'Pusat Belanja' },
                            { value: 'perkantoran', label: 'Perkantoran' },
                            { value: 'pertokoan', label: 'Pertokoan' },
                            { value: 'pkl', label: 'PKL/Gerobak/Tenda' },
                            { value: 'lainnya', label: 'Lainnya' },
                        ].map((option) => (
                            <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="lingkunganUsaha"
                                    value={option.value}
                                    checked={data.lingkunganUsaha === option.value}
                                    onChange={(e) => handleChange('lingkunganUsaha', e.target.value)}
                                    className="form-radio h-5 w-5 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-gray-700 text-sm">{option.label}</span>
                            </label>
                        ))}
                    </div>
                    {data.lingkunganUsaha === 'lainnya' && (
                        <div className="mt-2">
                            <Input
                                placeholder="Sebutkan lingkungan usaha..."
                                value={data.lingkunganUsahaLainnya || ''}
                                onChange={(e) => handleChange('lingkunganUsahaLainnya', e.target.value)}
                            />
                        </div>
                    )}
                    {errors.lingkunganUsaha && <p className="text-red-500 text-xs mt-1">{errors.lingkunganUsaha}</p>}
                </div>

                <RadioGroup
                    label="Status Tempat"
                    name="statusTempat"
                    required={true}
                    options={[
                        { value: 'milik_sendiri', label: 'Milik Sendiri' },
                        { value: 'sewa', label: 'Sewa' },
                    ]}
                    value={data.statusTempat || ''}
                    onChange={(val) => handleChange('statusTempat', val)}
                />
                {errors.statusTempat && <p className="text-red-500 text-xs mt-1">{errors.statusTempat}</p>}
            </FormSection>

            {/* Operasional Usaha */}
            <FormSection title="Operasional Usaha">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                        label="Tanggal Berdiri"
                        type="date"
                        value={data.tanggalBerdiri || ''}
                        onChange={(e) => handleChange('tanggalBerdiri', e.target.value)}
                    />
                    <div className="flex gap-4">
                        <div className="flex-grow">
                            <label className="block text-gray-900 font-bold mb-2 text-sm">Jam Operasional</label>
                            <div className="flex items-center gap-2">
                                <select
                                    className="w-full px-3 py-2 border border-gray-300 rounded text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    value={data.jamBuka || ''}
                                    onChange={(e) => handleChange('jamBuka', e.target.value)}
                                >
                                    <option value="">Buka</option>
                                    <option value="08:00">08:00</option>
                                    <option value="09:00">09:00</option>
                                    <option value="10:00">10:00</option>
                                    {/* Additional Hours */}
                                    <option value="11:00">11:00</option>
                                    <option value="12:00">12:00</option>
                                </select>
                                <span>-</span>
                                <select
                                    className="w-full px-3 py-2 border border-gray-300 rounded text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    value={data.jamTutup || ''}
                                    onChange={(e) => handleChange('jamTutup', e.target.value)}
                                >
                                    <option value="">Tutup</option>
                                    <option value="17:00">17:00</option>
                                    <option value="18:00">18:00</option>
                                    <option value="19:00">19:00</option>
                                    <option value="20:00">20:00</option>
                                    <option value="21:00">21:00</option>
                                    <option value="22:00">22:00</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex-grow">
                            <Input
                                label="Jumlah Karyawan"
                                placeholder="12"
                                type="number"
                                value={data.jumlahKaryawan || ''}
                                onChange={(e) => handleChange('jumlahKaryawan', e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </FormSection>
        </div>
    );
};

export default Step2DataUsaha;
