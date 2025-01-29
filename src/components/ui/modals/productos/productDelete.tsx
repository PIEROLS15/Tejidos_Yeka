import React from 'react';
import { Products } from '@/types/products';
import { CiCircleAlert } from "react-icons/ci";

interface DeleteProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Products | null;
    onDelete: (productId: number) => void;
}

const DeleteProductModal: React.FC<DeleteProductModalProps> = ({ isOpen, onClose, product, onDelete }) => {
    if (!product) return null;

    return (
        isOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-lg dark:bg-dark">
                    <div className='flex justify-center items-center pb-4'>
                        <CiCircleAlert className='text-[150px] text-primary dark:text-secondary' />
                    </div>
                    <div className='text-center text-dark dark:text-white pb-4'>
                        <h1 className="text-xl font-bold mb-4">Eliminar <span className='text-primary dark:text-secondary'>{product.nombre}</span></h1>
                        <h2 className="text-xl mb-4">
                            ¿Estás seguro de eliminar este producto?
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
                            onClick={() => onDelete(product.id)}
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

export default DeleteProductModal;
