import React from 'react';

const ErrorText = ({ message }) => {
    if (!message) return null;

    return (
        <p className="text-red-500 text-sm -mt-3 mb-3">{message}</p>
    );
};

export default ErrorText;
