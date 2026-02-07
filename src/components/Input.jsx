import React from 'react';

const Input = ({ label, required, placeholder, type = "text", error, ...props }) => {
    return (
        <div className="mb-4">
            {label && (
                <label className="block text-gray-900 font-bold mb-2 text-sm">
                    {label} {required && <span className="text-red-600">*</span>}
                </label>
            )}
            <input
                type={type}
                className={`w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${props.disabled ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white text-gray-700'} ${props.className || ''}`}
                placeholder={placeholder}
                {...props}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
};

export default Input;
