import React from 'react';
import { FaAngleDown } from 'react-icons/fa';

interface Color {
    id: number;
    colores: {
        nombre: string;
        codigo_color: string;
    };
    cantidad: number;
}

interface ColorDropdownProps {
    colors: Color[];
    selectedColor: string;
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    label: string;
}

const ColorDropdown: React.FC<ColorDropdownProps> = ({ label, colors, selectedColor, onChange }) => {
    return (
        <>
            <strong className='text-[12px] 2xl:text-[16px]'>{label}</strong>
            <div className="relative w-full mb-2 2xl:mb-4">
                <select
                    className="border border-darklight p-2 w-full rounded-[10px] text-[12px] 2xl:text-[16px] text-dark bg-whitedark focus:outline-none dark:bg-darklight dark:text-white dark:border-white appearance-none pr-8"
                    onChange={onChange}
                    value={selectedColor || ''}
                >
                    {colors.map((color) => (
                        <option key={color.id} value={color.colores.nombre}>
                            {color.colores.nombre} {color.colores.codigo_color} - {color.cantidad} unidades
                        </option>
                    ))}
                </select>
                <FaAngleDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark pointer-events-none dark:text-white" />
            </div>
        </>
    );
};

export default ColorDropdown;
