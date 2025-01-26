'use client'
import React, { useEffect, useState } from 'react';
import Loader from '@/components/loader';
import ReusableTable from '@/components/ui/tables';
import ButtonNewAdmin from '@/components/ui/buttons/buttonNewAdmin';
import PromocionModal from '@/components/ui/modals/promociones/promocionModal';
import EditPromocionModal from '@/components/ui/modals/promociones/editPromocionModal';
import { FaEye, FaEdit } from "react-icons/fa";

interface Promos {
    id: number;
    id_producto: number,
    id_promocion: number,
    status: boolean,
    productos: {
        id: number,
        nombre: string,
        precio: number,
    },
    promociones: {
        id: number,
        nombre: string,
        porcentaje_descuento: number,
        fecha_inicio: Date,
        fecha_fin: Date
    }
}

const PromosTable = () => {
    const [colorList, setColorList] = useState<Promos[]>([]);
    const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedPromocion, setSelectedPromocion] = useState<Promos | null>(null);

    // Función para obtener las promociones desde la API
    const fetchPromos = async () => {
        try {
            const response = await fetch('/api/promociones');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data: Promos[] = await response.json();
            setColorList(data);
        } catch (error) {
            console.error('Error fetching promotions:', error);
        }
    };

    // Llamar a fetchPromos al montar el componente
    useEffect(() => {
        fetchPromos();
    }, []);

    const calcularPrecioConDescuento = (precio: number, porcentajeDescuento: number) => {
        return precio - (precio * (porcentajeDescuento / 100));
    };

    // Datos para la tabla
    const tableData = colorList.map((promos) => ({
        id: promos.id,
        nombrePromo: promos.promociones.nombre,
        nombreProducto: promos.productos.nombre,
        precioProducto: 'S/ ' + promos.productos.precio,
        descuento: promos.promociones.porcentaje_descuento + '%',
        precioDescuento: 'S/ ' + calcularPrecioConDescuento(promos.productos.precio, promos.promociones.porcentaje_descuento),
        estado: promos.status ? (
            <span className="px-2 py-1 text-white bg-[#28A745] rounded-lg">Activo</span>
        ) : (
            <span className="px-2 py-1 text-white bg-red-500 rounded-lg">Inactivo</span>
        ),
        acciones: (
            <button
                className="bg-[#28A745] p-2 rounded-lg text-white flex items-center"
                onClick={() => {
                    setSelectedPromocion(promos);
                    setIsEditModalOpen(true);
                }}
            >
                <FaEdit className="mr-2" />
                Editar
            </button>
        ),
    }));

    return (
        <div className="p-4">
            <Loader duration={1000} />
            <div className="flex flex-row items-center space-x-6 mb-5">
                <h1 className="text-2xl font-bold text-dark dark:text-white">Lista de Descuentos</h1>
                <ButtonNewAdmin onClick={() => setIsPromoModalOpen(true)} />
            </div>

            <ReusableTable headers={['ID', 'Nombre Promoción', 'Nombre Producto', 'Precio Producto', 'Descuento', 'Precio Descuento', 'Estado', 'Acciones']} data={tableData} itemsPerPage={10} />

            <PromocionModal
                isOpen={isPromoModalOpen}
                onClose={() => setIsPromoModalOpen(false)}
                onColorAdded={fetchPromos}
            />
            <EditPromocionModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onPromocionUpdated={fetchPromos}
                promocion={selectedPromocion}
            />
        </div>
    );
};

export default PromosTable;
