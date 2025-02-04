'use client'

import React, { useEffect, useState } from 'react';
import Loader from '@/components/loader';
import ReusableTable from '@/components/ui/tables';
import ButtonNewAdmin from '@/components/ui/buttons/buttonNewAdmin';
import { toast } from 'react-toastify';
import NewMaterial from '@/components/ui/modals/materiales/newMaterial';
import { FaTrash } from "react-icons/fa";
import DeleteMaterialModal from '@/components/ui/modals/materiales/deleteMaterial';

interface Materials {
    id: number;
    nombre: string;
}

const MaterialsTable = () => {
    const [materialList, setMaterialList] = useState<Materials[]>([]);
    const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
    const [selectedMaterial, setSelectedMaterial] = useState<Materials | null>(null);
    const [selectedMaterialId, setSelectedMaterialId] = useState<number | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // Función para obtener los materiales desde la API
    const fetcMaterials = async () => {
        try {
            const response = await fetch('/api/materiales');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data: Materials[] = await response.json();
            setMaterialList(data);
        } catch (error) {
            console.error('Error fetching brands:', error);
        }
    };

    // Llamar a fetcMaterials al montar el componente
    useEffect(() => {
        fetcMaterials();
    }, []);


    const openDeleteModal = (materialId: number) => {
        setSelectedMaterialId(materialId);
        const MaterialToDelete = materialList.find(material => material.id === materialId);
        if (MaterialToDelete) {
            setSelectedMaterial(MaterialToDelete);
        }
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setSelectedMaterial(null);
    };

    const handleDeleteMaterial = async () => {
        if (selectedMaterialId !== null) {
            try {
                // Buscar la marca seleccionado
                const brandToDelete = materialList.find(material => material.id === selectedMaterialId);

                // Eliminar la categoría 
                const response = await fetch(`/api/materiales?id=${selectedMaterialId}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    throw new Error('Failed to delete material');
                }

                // Actualizar la lista local
                setMaterialList(prevList => prevList.filter(material => material.id !== selectedMaterialId));
                toast.success('Material eliminado correctamente');

                // Cerrar el modal
                setIsDeleteModalOpen(false);
                setSelectedMaterialId(null);

            } catch (error) {
                console.error('Error deleting material:', error);
                toast.error('Error al eliminar el material');
            }
        }
    };

    const tooltipStyles =
        "absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 text-sm text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity bg-darklight dark:bg-white dark:text-dark";

    const tableData = materialList.map((material) => ({
        id: material.id,
        nombre: material.nombre,
        acciones: (
            <div className="flex space-x-2 justify-center items-center">
                <div className="group relative">
                    <button
                        onClick={() => openDeleteModal(material.id)}
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
                <h1 className="text-2xl font-bold text-dark dark:text-white">Lista de Materiales</h1>
                <ButtonNewAdmin onClick={() => setIsMaterialModalOpen(true)} />
            </div>

            <ReusableTable headers={['ID', 'Nombre', 'Acciones']} data={tableData} itemsPerPage={10} />

            <NewMaterial
                isOpen={isMaterialModalOpen}
                onClose={() => setIsMaterialModalOpen(false)}
                onMaterialAdded={fetcMaterials}
            />

            {isDeleteModalOpen && (
                <DeleteMaterialModal
                    isOpen={isDeleteModalOpen}
                    onClose={closeDeleteModal}
                    material={selectedMaterial}
                    onDelete={handleDeleteMaterial}
                />
            )}
        </div>
    );
}

export default MaterialsTable;