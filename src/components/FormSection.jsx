import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const FormSection = ({ title, children, isOpen: initialIsOpen = true }) => {
    const [isOpen, setIsOpen] = useState(initialIsOpen);

    return (
        <div className="mb-6 border-b border-gray-200 pb-6">
            <div
                className="bg-[#fbbf24] px-4 py-3 flex justify-between items-center cursor-pointer rounded-t"
                onClick={() => setIsOpen(!isOpen)}
            >
                <h3 className="font-semibold text-gray-900">{title}</h3>
                {isOpen ? <FaChevronDown className="text-gray-900" /> : <FaChevronDown className="text-gray-900 transform -rotate-90" />}
            </div>

            {isOpen && (
                <div className="bg-white p-6 border-x border-b border-gray-200 rounded-b">
                    {children}
                </div>
            )}
        </div>
    );
};

export default FormSection;
