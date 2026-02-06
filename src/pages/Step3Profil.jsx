import React, { useState } from 'react';
import FormSection from '../components/FormSection';
import Input from '../components/Input';

const Step3Profil = () => {
    const [useOwnerData, setUseOwnerData] = useState(false);

    return (
        <FormSection title="Data Penanggung Jawab Usaha">
            <div className="mb-6">
                <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={useOwnerData}
                        onChange={(e) => setUseOwnerData(e.target.checked)}
                        className="form-checkbox h-5 w-5 text-blue-600 rounded bg-blue-600 border-none focus:ring-blue-500"
                        style={{ accentColor: '#0000ff' }} // Approximating the blue from screenshot
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
                        disabled={useOwnerData}
                    />
                    <Input
                        label="Nama Penghubung (PIC 2)"
                        placeholder="Siti Rahmawati"
                    />
                </div>

                {/* Right Column */}
                <div>
                    <Input
                        label="No Handphone (PIC 1)"
                        required={true}
                        type="tel"
                        placeholder="081234567890"
                        disabled={useOwnerData}
                    />
                    <Input
                        label="No Handphone (PIC 2)"
                        type="tel"
                        placeholder="081298765432"
                    />
                </div>
            </div>
        </FormSection>
    );
};

export default Step3Profil;


