import React from 'react';

interface ProductInputProps {
    label: string;
    value: string | number;
    inputStyles?: string;
    disabled?: boolean;
}

const InputAdmin: React.FC<ProductInputProps> = ({ label, value, inputStyles, disabled }) => {
    return (
        <div className="flex flex-col">
            <strong>{label}:</strong>
            <input type="text" value={value} className={inputStyles} disabled={disabled} />
        </div>
    );
};

export default InputAdmin;
