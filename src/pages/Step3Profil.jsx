import React, { useState } from 'react';
import FormSection from '../components/FormSection';
import Input from '../components/Input';

const Step3Profil = ({ data = {}, updateData, dataPemilik = {}, errors = {} }) => {
    // We can keep local state for the checkbox, or derive it.
    // Let's use local state for the checkbox UI.
    const [useOwnerData, setUseOwnerData] = useState(false);

    const handleCheckboxChange = (e) => {
        const isChecked = e.target.checked;
        setUseOwnerData(isChecked);

        if (isChecked) {
            // Auto-fill from owner data
            updateData({
                namaPIC1: dataPemilik.namaPemilik || '',
                noHpPIC1: dataPemilik.noHpPemilik || ''
            });
        }
        // Note: When unchecked, we preserve the current data (better UX)
        // User can manually edit or clear if needed
    };

    const handleChange = (field, value) => {
        updateData({ [field]: value });
    };

    return (
        <FormSection title="Data Penanggung Jawab Usaha">
            <div className="mb-6">
                <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={useOwnerData}
                        onChange={handleCheckboxChange}
                        className="form-checkbox h-5 w-5 text-blue-600 rounded bg-blue-600 border-none focus:ring-blue-500"
                        style={{ accentColor: '#0000ff' }}
                    />
                    <span className="text-red-600 font-bold">Sama dengan Data Pemilik</span>
                </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div>
                    <Input
                        label="Nama Penghubung (PIC 1)"
                        required={true}
                        placeholder="Andi Pratama"
                        readOnly={useOwnerData}
                        className={useOwnerData ? 'bg-gray-100' : ''}
                        value={data.namaPIC1 || ''}
                        onChange={(e) => handleChange('namaPIC1', e.target.value)}
                        error={errors.namaPIC1}
                    />
                    <Input
                        label="Nama Penghubung (PIC 2)"
                        placeholder="Siti Rahmawati"
                        value={data.namaPIC2 || ''}
                        onChange={(e) => handleChange('namaPIC2', e.target.value)}
                    />
                </div>

                {/* Right Column */}
                <div>
                    <Input
                        label="No Handphone (PIC 1)"
                        required={true}
                        type="tel"
                        placeholder="081234567890"
                        readOnly={useOwnerData}
                        className={useOwnerData ? 'bg-gray-100' : ''}
                        value={data.noHpPIC1 || ''}
                        onChange={(e) => handleChange('noHpPIC1', e.target.value)}
                        error={errors.noHpPIC1}
                    />
                    <Input
                        label="No Handphone (PIC 2)"
                        type="tel"
                        placeholder="081298765432"
                        value={data.noHpPIC2 || ''}
                        onChange={(e) => handleChange('noHpPIC2', e.target.value)}
                    />
                </div>
            </div>
        </FormSection>
    );
};

export default Step3Profil;


