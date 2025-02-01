import React from 'react';
import { FaAngleDown } from 'react-icons/fa';

interface DropdownAdminProps {
    label: string;
    options: { id: string | number; nombre: string }[];
    selectedValue: string | number;
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const DropdownAdmin: React.FC<DropdownAdminProps> = ({ label, options, selectedValue, onChange }) => {
    return (
        <div className="space-y-2 text-dark dark:text-white w-full relative">
            <strong className='text-[12px] 2xl:text-[16px]'>{label}</strong>
            <div className="relative w-full">
                <select
                    value={selectedValue}
                    onChange={onChange}
                    className="border border-darklight p-2 w-full rounded-[10px] text-[12px] 2xl:text-[16px] text-dark bg-whitedark focus:outline-none dark:bg-darklight dark:text-white dark:border-white appearance-none pr-8"
                >
                    <option value="">Seleccione una opción</option>
                    {options.map((option) => (
                        <option key={option.id} value={option.id}>
                            {option.nombre}
                        </option>
                    ))}
                </select>
                <FaAngleDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark pointer-events-none dark:text-white" />
            </div>
        </div>
    );
};

export default DropdownAdmin;