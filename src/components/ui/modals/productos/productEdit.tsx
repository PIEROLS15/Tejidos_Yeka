'use client';

import React, { useState, useEffect } from 'react';
import { FaSave, FaTimes } from 'react-icons/fa';
import { Products } from '@/types/products';
import Image from 'next/image';

interface ProductEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Products | null;
    onSave: (updatedProduct: Products) => void;
}

interface Categorias {
    id: number;
    nombre: string;
}

interface Materiales {
    id: number;
    nombre: string;
}

interface Marcas {
    id: number;
    nombre: string;
}

type ProductImage = {
    id?: number;
    imagen: string;
    colores?: {
        id: number;
        nombre: string;
        codigo_color: string;
    };
};

const ProductEditModal: React.FC<ProductEditModalProps> = ({
    isOpen,
    onClose,
    product,
    onSave,
}) => {
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [editedProduct, setEditedProduct] = useState<Products | null>(null);
    const [categorias, setCategorias] = useState<Categorias[]>([]);
    const [selectedCategorias, setSelectedCategorias] = useState<string>('');
    const [materiales, setMateriales] = useState<Materiales[]>([]);
    const [selectedMateriales, setSelectedMateriales] = useState<string>('');
    const [marcas, setMarcas] = useState<Marcas[]>([]);
    const [selectedMarcas, setSelectedMarcas] = useState<string>('');
    const [error, setError] = useState<string>('');

    // Obtener categorías
    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const response = await fetch('/api/categorias');
                if (!response.ok) throw new Error('Error al cargar las categorías');
                const data = await response.json();
                setCategorias(data);
            } catch (error) {
                setError('Error al cargar las categorías');
            }
        };
        fetchCategorias();
    }, []);

    // Obtener materiales
    useEffect(() => {
        const fetchMateriales = async () => {
            try {
                const response = await fetch('/api/materiales');
                if (!response.ok) throw new Error('Error al cargar los materiales');
                const data = await response.json();
                setMateriales(data);
            } catch (error) {
                setError('Error al cargar los materiales');
            }
        };
        fetchMateriales();
    }, []);

    // Obtener marcas
    useEffect(() => {
        const fetchMarcas = async () => {
            try {
                const response = await fetch('/api/marcas');
                if (!response.ok) throw new Error('Error al cargar las marcas');
                const data = await response.json();
                setMarcas(data);
            } catch (error) {
                setError('Error al cargar las marcas');
            }
        };
        fetchMarcas();
    }, []);

    // Establecer el primer color disponible por defecto cuando el modal se abre
    useEffect(() => {
        if (isOpen && product && product.stockColores.length > 0) {
            setSelectedColor(product.stockColores[0].colores.nombre);
        }
    }, [isOpen, product]);

    // Inicializar el estado del producto editado
    useEffect(() => {
        if (product) {
            setEditedProduct({ ...product });
            setSelectedCategorias(product.categoriasProductos.id.toString());
            setSelectedMateriales(product.materiales?.id?.toString() || '');
            setSelectedMarcas(product.marcas?.id?.toString() || '');
        }
    }, [product]);

    if (!isOpen || !product || !editedProduct) return null;

    // Filtrar las imágenes por el color seleccionado
    const filteredImages = selectedColor
        ? product.imagenesColores.filter(image => image.colores.nombre === selectedColor)
        : product.imagenesColores;

    // Convertir imagen_principal a la estructura de ProductImage
    const mainImage: ProductImage = {
        imagen: product.imagen_principal,
        colores: undefined,
    };

    // Determinar qué imágenes mostrar
    const imagesToShow: ProductImage[] = product.imagen_principal
        ? [mainImage]
        : filteredImages;

    // Manejar cambios en los inputs
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditedProduct(prev => prev ? {
            ...prev,
            [name]: value
        } : null);
    };

    // Manejar cambios en la categoría
    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = parseInt(e.target.value);
        setSelectedCategorias(e.target.value);
        setEditedProduct(prev => prev ? {
            ...prev,
            categoriasProductos: {
                ...prev.categoriasProductos,
                id: selectedId,
            },
        } : null);
    };

    // Manejar cambios en el material
    const handleMaterialChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = parseInt(e.target.value);
        setSelectedMateriales(e.target.value);
        setEditedProduct(prev => prev ? {
            ...prev,
            materiales: {
                ...prev.materiales,
                id: selectedId,
            },
        } : null);
    };

    // Manejar cambios en la marca
    const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = parseInt(e.target.value);
        setSelectedMarcas(e.target.value);
        setEditedProduct(prev => prev ? {
            ...prev,
            marcas: {
                ...prev.marcas,
                id: selectedId,
            },
        } : null);
    };

    // Guardar los cambios
    const handleSave = async () => {
        if (editedProduct) {
            try {
                const response = await fetch(`/api/productos/${editedProduct.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        nombre: editedProduct.nombre,
                        descripcion: editedProduct.descripcion,
                        precio: editedProduct.precio,
                        id_categoria: editedProduct.categoriasProductos.id,
                        id_material: editedProduct.materiales?.id || null,
                        id_marca: editedProduct.marcas?.id || null,
                    }),
                });

                if (!response.ok) {
                    throw new Error('Error al actualizar el producto');
                }

                const updatedProduct = await response.json();
                onSave(updatedProduct);
                onClose();
            } catch (error) {
                setError('Error al guardar los cambios');
                console.error(error);
            }
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
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

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

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

                    <div className="space-y-2 text-dark dark:text-white w-full">
                        <strong> Categoría: </strong>
                        <select
                            value={selectedCategorias}
                            onChange={handleCategoryChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        >
                            <option value="">Seleccione una categoría</option>
                            {categorias.map((categoria) => (
                                <option key={categoria.id} value={categoria.id}>
                                    {categoria.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    {editedProduct.materiales && (
                        <div className="space-y-2 text-dark dark:text-white w-full">
                            <strong> Materiales: </strong>
                            <select
                                value={selectedMateriales}
                                onChange={handleMaterialChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            >
                                <option value="">Seleccione un material</option>
                                {materiales.map((material) => (
                                    <option key={material.id} value={material.id}>
                                        {material.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {editedProduct.marcas && (
                        <div className="space-y-2 text-dark dark:text-white w-full">
                            <strong> Marcas: </strong>
                            <select
                                value={selectedMarcas}
                                onChange={handleBrandChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            >
                                <option value="">Seleccione una marca</option>
                                {marcas.map((marca) => (
                                    <option key={marca.id} value={marca.id}>
                                        {marca.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div>
                        {(product.stockColores.length > 0 || imagesToShow.length > 0) && (
                            <div className="flex-1">
                                <div className='text-dark dark:text-white'>
                                    {product.stockColores.length > 0 && (
                                        <>
                                            <h3 className="font-semibold">Colores Disponibles:</h3>
                                            <select
                                                className="mt-2 p-2 border border-dark rounded bg-whitedark dark:bg-darklight dark:text-white focus:outline-none "
                                                onChange={(e) => setSelectedColor(e.target.value)}
                                                value={selectedColor || ''}
                                            >
                                                {product.stockColores.map((color) => (
                                                    <option key={color.id} value={color.colores.nombre}>
                                                        {color.colores.nombre}  {color.colores.codigo_color} - {color.cantidad} unidades
                                                    </option>
                                                ))}
                                            </select>
                                        </>
                                    )}

                                    <h3 className="font-semibold">Imagen:</h3>
                                    <div className="grid grid-cols-3 gap-2 mt-2">
                                        {imagesToShow.map((image, index) => (
                                            <div key={index} className="w-full h-32 overflow-hidden relative">
                                                <Image
                                                    src={image.imagen}
                                                    alt={`Imagen del producto`}
                                                    layout="responsive"
                                                    width={100}
                                                    height={128}
                                                    objectFit="cover"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
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