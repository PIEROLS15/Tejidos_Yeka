'use client'

import React, { useEffect, useState } from 'react';
import Loader from '@/components/loader';
import ReusableTable from '@/components/ui/tables';
import ButtonNewAdmin from '@/components/ui/buttons/buttonNewAdmin';
import NewCategory from '@/components/ui/modals/categorias/newCategory';
import { FaTrash } from "react-icons/fa";
import DeleteCategoryModal from '@/components/ui/modals/categorias/deleteCategory';
import { toast } from 'react-toastify';

interface Categoria {
    id: number;
    nombre: string;
}

const CategoriasTable = () => {
    const [categoryList, setCategoryList] = useState<Categoria[]>([]);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Categoria | null>(null);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // Función para obtener las categorias desde la API
    const fetchCategorys = async () => {
        try {
            const response = await fetch('/api/categorias');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data: Categoria[] = await response.json();
            setCategoryList(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    // Llamar a fetchCategorys al montar el componente
    useEffect(() => {
        fetchCategorys();
    }, []);

    const openDeleteModal = (categoryId: number) => {
        setSelectedCategoryId(categoryId);
        const categoryToDelete = categoryList.find(category => category.id === categoryId);
        if (categoryToDelete) {
            setSelectedCategory(categoryToDelete);
        }
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setSelectedCategory(null);
    };

    const handleDeleteCategory = async () => {
        if (selectedCategoryId) {
            try {
                // Eliminar la categoría 
                const response = await fetch(`/api/categorias?id=${selectedCategoryId}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    throw new Error('Failed to delete category');
                }

                // Actualizar la lista local
                setCategoryList(prevList => prevList.filter(category => category.id !== selectedCategoryId));
                toast.success('Categoría eliminada correctamente');

                // Cerrar el modal
                setIsDeleteModalOpen(false);
                setSelectedCategoryId(null);
            } catch (error) {
                console.error('Error deleting category:', error);
                toast.error('Error al eliminar la categoría');
            }
        }
    };

    const tooltipStyles =
        "absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 text-sm text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity bg-darklight dark:bg-white dark:text-dark";

    // Datos para la tabla
    const tableData = categoryList.map((category) => ({
        id: category.id,
        nombre: category.nombre,
        acciones: (
            <div className="flex space-x-2 justify-center items-center">
                <div className="group relative">
                    <button
                        onClick={() => openDeleteModal(category.id)}
                        className="bg-red-500 p-2 rounded-lg text-white flex items-center"
                    >
                        <FaTrash className='text-xl' />
                    </button>
                    <span className={tooltipStyles}>
                        Eliminar categoria
                    </span>
                </div>
            </div>
        )
    }));

    return (
        <div className="p-4">
            <Loader duration={1000} />
            <div className="flex flex-row items-center space-x-6 mb-5">
                <h1 className="text-2xl font-bold text-dark dark:text-white">Lista de Categorias</h1>
                <ButtonNewAdmin onClick={() => setIsCategoryModalOpen(true)} />
            </div>

            <ReusableTable headers={['ID', 'Nombre', 'Acciones']} data={tableData} itemsPerPage={10} />

            <NewCategory
                isOpen={isCategoryModalOpen}
                onClose={() => setIsCategoryModalOpen(false)}
                onColorAdded={fetchCategorys}
            />

            {isDeleteModalOpen && (
                <DeleteCategoryModal
                    isOpen={isDeleteModalOpen}
                    onClose={closeDeleteModal}
                    category={selectedCategory}
                    onDelete={handleDeleteCategory}
                />
            )}
        </div>
    );
}

export default CategoriasTable;