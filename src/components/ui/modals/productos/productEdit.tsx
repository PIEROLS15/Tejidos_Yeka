'use client'

import React, { useState, useEffect } from 'react';
import { FaSave, FaTimes } from 'react-icons/fa';
import { Products } from '@/types/products';

interface ProductEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Products | null;
    onSave: (updatedProduct: Products) => void;
}

const ProductEditModal: React.FC<ProductEditModalProps> = ({
    isOpen,
    onClose,
    product,
    onSave
}) => {
    const [editedProduct, setEditedProduct] = useState<Products | null>(null);

    useEffect(() => {
        if (product) {
            setEditedProduct({ ...product });
        }
    }, [product]);

    if (!isOpen || !editedProduct) return null;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditedProduct(prev => prev ? {
            ...prev,
            [name]: value
        } : null);
    };

    const handleSave = () => {
        if (editedProduct) {
            onSave(editedProduct);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Editar Producto</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <FaTimes />
                    </button>
                </div>

                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nombre</label>
                        <input
                            type="text"
                            name="nombre"
                            value={editedProduct.nombre}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Descripción</label>
                        <textarea
                            name="descripcion"
                            value={editedProduct.descripcion}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            rows={3}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Precio</label>
                        <input
                            type="text"
                            name="precio"
                            value={editedProduct.precio}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                    </div>

                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 flex items-center"
                        >
                            <FaTimes className="mr-2" /> Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={handleSave}
                            className="bg-[#28A745] text-white px-4 py-2 rounded-md hover:bg-green-600 flex items-center"
                        >
                            <FaSave className="mr-2" /> Guardar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductEditModal;