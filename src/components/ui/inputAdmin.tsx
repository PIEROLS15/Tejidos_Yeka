import React from 'react';

interface ProductInputProps {
    label: string;
    placeholder?: string;
    value: string | number;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    inputStyles?: string;
    disabled?: boolean;
}

const InputAdmin: React.FC<ProductInputProps> = ({ label, placeholder, value, inputStyles, disabled, onChange }) => {
    return (
        <div className="flex flex-col">
            <strong className='text-dark dark:text-white mb-2'>{label}:</strong>
            <input type="text" value={value} className={inputStyles} placeholder={placeholder} disabled={disabled} onChange={onChange} />
        </div>
    );
};

export default InputAdmin;
