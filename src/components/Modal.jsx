import React from 'react';

const Modal = ({ isOpen, onClose, title, message, onConfirm, confirmText = 'Ya', cancelText = 'Tidak', type = 'confirm' }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50 transition-opacity">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                <div className="bg-gray-100 px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                </div>

                <div className="px-6 py-6">
                    <p className="text-gray-700">{message}</p>
                </div>

                <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
                    {type === 'confirm' ? (
                        <>
                            <button
                                onClick={onClose}
                                className="px-6 py-2 bg-gray-200 text-gray-800 rounded font-semibold hover:bg-gray-300 transition-colors"
                            >
                                {cancelText}
                            </button>
                            <button
                                onClick={onConfirm}
                                className="px-6 py-2 bg-[#1e3a8a] text-white rounded font-semibold hover:bg-blue-800 transition-colors shadow-md"
                            >
                                {confirmText}
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-[#1e3a8a] text-white rounded font-semibold hover:bg-blue-800 transition-colors shadow-md"
                        >
                            OK
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Modal;
