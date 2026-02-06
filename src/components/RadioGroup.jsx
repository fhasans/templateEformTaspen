import React from 'react';

const RadioGroup = ({ label, required, name, options = [], value, onChange }) => {
    return (
        <div className="mb-4">
            {label && (
                <label className="block text-gray-900 font-bold mb-2 text-sm">
                    {label} {required && <span className="text-red-600">*</span>}
                </label>
            )}
            <div className="flex gap-8">
                {options.map((option) => (
                    <label key={option.value} className="flex items-center cursor-pointer">
                        <input
                            type="radio"
                            name={name}
                            value={option.value}
                            checked={value === option.value}
                            onChange={() => onChange(option.value)}
                            className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500 mr-2"
                        />
                        <span className="text-gray-700">{option.label}</span>
                    </label>
                ))}
            </div>
        </div>
    );
};

export default RadioGroup;
