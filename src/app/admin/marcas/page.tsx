'use client'

import React, { useEffect, useState } from 'react';
import Loader from '@/components/loader';
import ReusableTable from '@/components/ui/tables';
import ButtonNewAdmin from '@/components/ui/buttons/buttonNewAdmin';
import { FaTrash } from "react-icons/fa";
import { toast } from 'react-toastify';
import NewBrand from '@/components/ui/modals/marcas/newBrand';
import DeleteBrandModal from '@/components/ui/modals/marcas/deleteBrand';
import Image from 'next/image';

interface Marcas {
    id: number;
    nombre: string;
    logo: string;
}

const MarcasTable = () => {
    const [brandList, setBrandList] = useState<Marcas[]>([]);
    const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState<Marcas | null>(null);
    const [selectedBrandId, setSelectedBrandId] = useState<number | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // Función para obtener las categorias desde la API
    const fetchBrands = async () => {
        try {
            const response = await fetch('/api/marcas');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data: Marcas[] = await response.json();
            setBrandList(data);
        } catch (error) {
            console.error('Error fetching brands:', error);
        }
    };

    // Llamar a fetchBrands al montar el componente
    useEffect(() => {
        fetchBrands();
    }, []);

    const openDeleteModal = (brandId: number) => {
        setSelectedBrandId(brandId);
        const brandToDelete = brandList.find(brand => brand.id === brandId);
        if (brandToDelete) {
            setSelectedBrand(brandToDelete);
        }
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setSelectedBrand(null);
    };

    const deleteImageFile = async (imagePath: string) => {
        try {
            // Extraer solo el nombre del archivo de la ruta completa
            const filename = imagePath.split('/').pop();

            if (!filename) {
                throw new Error('Nombre de archivo no válido');
            }

            const response = await fetch(`/api/upload/${filename}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Error al eliminar el archivo de imagen');
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error al eliminar el archivo de imagen:', error);
            throw error;
        }
    };


    const handleDeleteBrand = async () => {
        if (selectedBrandId !== null) {
            try {
                // Buscar la marca seleccionado
                const brandToDelete = brandList.find(brand => brand.id === selectedBrandId);

                if (brandToDelete?.logo) {
                    try {
                        await deleteImageFile(brandToDelete.logo);
                    } catch (error) {
                        console.error('Error al eliminar la imagen: ', error);
                    }
                }

                // Eliminar la categoría 
                const response = await fetch(`/api/marcas?id=${selectedBrandId}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    throw new Error('Failed to delete category');
                }

                // Actualizar la lista local
                setBrandList(prevList => prevList.filter(brand => brand.id !== selectedBrandId));
                toast.success('Marca eliminada correctamente');

                // Cerrar el modal
                setIsDeleteModalOpen(false);
                setSelectedBrandId(null);
            } catch (error) {
                console.error('Error deleting category:', error);
                toast.error('Error al eliminar la marca');
            }
        }
    };

    const tooltipStyles =
        "absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 text-sm text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity bg-darklight dark:bg-white dark:text-dark";

    // Datos para la tabla
    const tableData = brandList.map((brand) => ({
        id: brand.id,
        nombre: brand.nombre,
        logo: (
            <div className="flex justify-center items-center">
                <Image
                    src={brand.logo || '/icons/logo.png'}
                    alt={`Logo de ${brand.nombre}`}
                    width={80}
                    height={80}
                    className="object-cover rounded-full"
                />
            </div>
        ),
        acciones: (
            <div className="flex space-x-2 justify-center items-center">
                <div className="group relative">
                    <button
                        onClick={() => openDeleteModal(brand.id)}
                        className="bg-red-500 p-2 rounded-lg text-white flex items-center"
                    >
                        <FaTrash className='text-xl' />
                    </button>
                    <span className={tooltipStyles}>
                        Eliminar marca
                    </span>
                </div>
            </div>
        )
    }));

    return (
        <div className="p-4">
            <Loader duration={1000} />
            <div className="flex flex-row items-center space-x-6 mb-5">
                <h1 className="text-2xl font-bold text-dark dark:text-white">Lista de Marcas</h1>
                <ButtonNewAdmin onClick={() => setIsBrandModalOpen(true)} />
            </div>

            <ReusableTable headers={['ID', 'Nombre', 'logo', 'Acciones']} data={tableData} itemsPerPage={10} />

            <NewBrand
                isOpen={isBrandModalOpen}
                onClose={() => setIsBrandModalOpen(false)}
                onColorAdded={fetchBrands}
            />

            {isDeleteModalOpen && (
                <DeleteBrandModal
                    isOpen={isDeleteModalOpen}
                    onClose={closeDeleteModal}
                    brand={selectedBrand}
                    onDelete={handleDeleteBrand}
                />
            )}
        </div>
    );
}

export default MarcasTable;