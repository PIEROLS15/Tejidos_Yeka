'use client'

import React, { useEffect, useState } from 'react';
import Loader from '@/components/loader';
import ReusableTable from '@/components/ui/tables';
import ButtonNewAdmin from '@/components/ui/buttons/buttonNewAdmin';
import ColorModal from '@/components/ui/modals/colorModal';

interface Color {
    id: number;
    nombre: string;
    codigo_color: string;
}

const ColorsTable = () => {
    const [colorList, setColorList] = useState<Color[]>([]);
    const [isColorModalOpen, setIsColorModalOpen] = useState(false); // Cambié el nombre aquí

    // Función para obtener los colores desde la API
    const fetchColors = async () => {
        try {
            const response = await fetch('/api/colores');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data: Color[] = await response.json();
            setColorList(data);
        } catch (error) {
            console.error('Error fetching colors:', error);
        }
    };

    // Llamar a fetchColors al montar el componente
    useEffect(() => {
        fetchColors();
    }, []);

    // Datos para la tabla
    const tableData = colorList.map((color) => ({
        id: color.id,
        nombre: color.nombre,
        codigo: color.codigo_color,
    }));

    return (
        <div className="p-4">
            <Loader duration={1000} />
            <div className="flex flex-row items-center space-x-6 mb-5">
                <h1 className="text-2xl font-bold text-dark dark:text-white">Lista de Colores</h1>
                <ButtonNewAdmin onClick={() => setIsColorModalOpen(true)} /> {/* Cambié el estado aquí */}
            </div>

            <ReusableTable headers={['ID', 'Nombre', 'Código de Color']} data={tableData} itemsPerPage={10} />

            <ColorModal
                isOpen={isColorModalOpen} // Cambié el estado aquí también
                onClose={() => setIsColorModalOpen(false)} // Cambié el estado aquí también
                onColorAdded={fetchColors}
            />
        </div>
    );
};

export default ColorsTable;
