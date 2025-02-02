import React from 'react';
import { Category } from '@/types/category';
import { CiCircleAlert } from "react-icons/ci";

interface DeleteCategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    category: Category | null;
    onDelete: (categoryId: number) => void;
}

const DeleteCategoryModal: React.FC<DeleteCategoryModalProps> = ({ isOpen, onClose, category, onDelete }) => {
    if (!category) return null;

    return (
        isOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-lg dark:bg-dark">
                    <div className='flex justify-center items-center pb-4'>
                        <CiCircleAlert className='text-[150px] text-primary dark:text-secondary' />
                    </div>
                    <div className='text-center text-dark dark:text-white pb-4'>
                        <h1 className="text-xl font-bold mb-4">Eliminar <span className='text-primary dark:text-secondary'>{category.nombre}</span></h1>
                        <h2 className="text-xl mb-4">
                            ¿Estás seguro de eliminar esta categoria?
                        </h2>
                    </div>
                    <div className="flex justify-between">
                        <button
                            onClick={onClose}
                            className="bg-gray-300 text-dark px-4 py-2 rounded-md"
                        >
                            No, Cancelar!
                        </button>
                        <button
                            onClick={() => onDelete(category.id)}
                            className="bg-primary hover:bg-secondary text-white px-4 py-2 rounded-md"
                        >
                            Si, Eliminar!
                        </button>
                    </div>
                </div>
            </div>
        )
    );
};

export default DeleteCategoryModal;
