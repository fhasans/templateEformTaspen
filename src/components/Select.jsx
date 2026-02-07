import React from 'react';
import { FaChevronDown } from 'react-icons/fa';

const Select = ({ label, required, options = [], error, ...props }) => {
    return (
        <div className="mb-4">
            {label && (
                <label className="block text-gray-900 font-bold mb-2 text-sm">
                    {label} {required && <span className="text-red-600">*</span>}
                </label>
            )}
            <div className="relative">
                <select
                    className={`w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none ${props.className || ''}`}
                    {...props}
                >
                    {options.map((opt, idx) => (
                        <option key={idx} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <FaChevronDown size={12} />
                </div>
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
};

export default Select;
