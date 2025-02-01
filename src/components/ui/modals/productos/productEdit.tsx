'use client';

import React, { useState, useEffect } from 'react';
import { Products } from '@/types/products';
import Image from 'next/image';
import { toast } from 'react-toastify';
import dynamic from 'next/dynamic'
import 'react-quill/dist/quill.snow.css';
import DropdownAdmin from '@/components/ui/dropdowns/dropdownAdmin';
import ColorDropdown from '@/components/ui/dropdowns/dropdownColorAdmin';
import SaveButton from '@/components/ui/buttons/saveButtonAdmin';

// Cargar ReactQuill dinámicamente y desactivar SSR
const ReactQuill = dynamic(() => import('react-quill'), {
    ssr: false,
});

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
    const [editableStock, setEditableStock] = useState<number | null>(null);
    const [description, setDescription] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

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
        if (isOpen && product) {
            if (product.stockColores.length > 0) {
                setSelectedColor(product.stockColores[0].colores.nombre);
                setEditableStock(product.stockColores[0].cantidad);
            } else if (product.stock !== null) {
                setEditableStock(product.stock);
            }
        }
    }, [isOpen, product]);

    // Inicializar el estado del producto editado y la descripción en Quill
    useEffect(() => {
        if (product) {
            setEditedProduct({ ...product });
            setSelectedCategorias(product.categoriasProductos.id.toString());
            setSelectedMateriales(product.materiales?.id?.toString() || '');
            setSelectedMarcas(product.marcas?.id?.toString() || '');
            setDescription(product.descripcion);
        }
    }, [product]);

    // Actualizar el stock editable cuando se selecciona un color
    useEffect(() => {
        if (selectedColor && product) {
            const selectedStockColor = product.stockColores.find(
                (sc) => sc.colores.nombre === selectedColor
            );
            if (selectedStockColor) {
                setEditableStock(selectedStockColor.cantidad);
            }
        }
    }, [selectedColor, product]);

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

    // Manejar cambios en el stock editable
    const handleStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        setEditableStock(isNaN(value) ? null : value);
    };

    // Manejar cambios en la descripción con Quill
    const handleDescriptionChange = (value: string) => {
        setDescription(value);
        setEditedProduct(prev => prev ? {
            ...prev,
            descripcion: value,
        } : null);
    };

    // Guardar los cambios
    const handleSave = async () => {
        if (editedProduct) {
            try {
                const updatedProduct = {
                    ...editedProduct,
                    stock: product.imagen_principal ? editableStock : editedProduct.stock,
                    stockColores: product.imagen_principal
                        ? editedProduct.stockColores
                        : editedProduct.stockColores.map(sc => ({
                            ...sc,
                            cantidad: sc.colores.nombre === selectedColor ? editableStock || 0 : sc.cantidad,
                        })),
                    id_categoria: parseInt(selectedCategorias),
                    id_material: parseInt(selectedMateriales),
                    id_marca: parseInt(selectedMarcas),
                };

                setIsLoading(true);

                const response = await fetch(`/api/productos/${updatedProduct.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedProduct),
                });

                if (!response.ok) {
                    throw new Error('Error al actualizar el producto');
                }

                const savedProduct = await response.json();
                onSave(savedProduct);
                onClose();
                toast.success('Producto actualizado correctamente');
            } catch (error) {
                setError('Error al guardar los cambios');
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const inputStyles =
        "border border-darklight p-2 w-full rounded-[10px] text-[12px] 2xl:text-[16px] text-dark bg-whitedark focus:outline-none dark:bg-darklight dark:text-white dark:border-white"

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="rounded-lg shadow-lg max-w-4xl w-full">
                {/* Encabezado del Modal */}
                <div className="flex items-center justify-between bg-primary text-white p-2 2xl:p-3 w-full rounded-t-lg">
                    <h2 className="text-sm 2xl:text-xl font-bold">Editar Producto</h2>
                    <button
                        onClick={onClose}
                        className="text-xl text-gray-500 ml-4"
                    >
                        <Image
                            src={`/icons/closeWhite.svg`}
                            alt="Close"
                            width={24}
                            height={24}
                        />
                    </button>
                </div>

                {/* Contenido del Modal */}
                <div className='bg-white dark:bg-dark p-4 2xl:p-8 flex rounded-b-lg w-full'>
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 w-full">
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}

                    <form className="space-y-2 2xl:space-y-4 w-full">
                        <div className='flex flex-row w-full'>
                            {/* Izquierda */}
                            <div className="w-1/2 pr-4 space-y-2 2xl:space-y-4">
                                {/* Nombre del Producto */}
                                <div className="space-y-2 text-dark dark:text-white">
                                    <strong className='text-[12px] 2xl:text-[16px]'> Nombre del Producto: </strong>
                                    <input
                                        type="text"
                                        name="nombre"
                                        value={editedProduct.nombre}
                                        onChange={handleInputChange}
                                        className={inputStyles}
                                    />
                                </div>

                                {/* Precio */}
                                <div className="space-y-2 text-dark dark:text-white">
                                    <strong className='text-[12px] 2xl:text-[16px]'> Precio del Producto: </strong>
                                    <input
                                        type="text"
                                        name="precio"
                                        value={editedProduct.precio}
                                        onChange={handleInputChange}
                                        className={inputStyles}
                                    />
                                </div>

                                {/* Categoria */}
                                <DropdownAdmin
                                    label="Categoría:"
                                    options={categorias}
                                    selectedValue={selectedCategorias}
                                    onChange={handleCategoryChange}
                                />

                                {editedProduct.materiales && (
                                    <DropdownAdmin
                                        label="Materiales:"
                                        options={materiales}
                                        selectedValue={selectedMateriales}
                                        onChange={handleMaterialChange}
                                    />
                                )}

                                {editedProduct.marcas && (
                                    <DropdownAdmin
                                        label="Materiales:"
                                        options={marcas}
                                        selectedValue={selectedMarcas}
                                        onChange={handleBrandChange}
                                    />
                                )}

                                <div className="space-y-2 text-dark dark:text-white w-full">
                                    <strong> Descripción del Producto: </strong>
                                    <ReactQuill
                                        value={description}
                                        onChange={handleDescriptionChange}
                                        className="w-full mt-2 p-3 border border-dark rounded span-white bg-whitedark dark:bg-darklight dark:text-white dark:border-white focus:outline-none"
                                    />
                                </div>
                            </div>
                            {/* derecha */}
                            <div className="w-1/2 pl-4 space-y-2 2xl:space-y-4">
                                {/* Mostrar el stock editable solo si no es null */}
                                {(product.stock !== null || (selectedColor && product.stockColores.length > 0)) && (
                                    <div className="space-y-2 text-dark dark:text-white">
                                        <strong className='text-[12px] 2xl:text-[16px]'>
                                            {product.imagen_principal ? 'Stock General' : `Stock para ${selectedColor}`}
                                        </strong>
                                        <input
                                            type="number"
                                            value={editableStock ?? ''}
                                            onChange={handleStockChange}
                                            className={inputStyles}
                                        />
                                    </div>
                                )}

                                {/* Selector de colores y visualización de imágenes */}
                                <div>
                                    {(product.stockColores.length > 0 || imagesToShow.length > 0) && (
                                        <div className="flex-1">
                                            <div className='text-dark dark:text-white'>
                                                {/* Usar el componente ColorDropdown */}
                                                {product.stockColores.length > 0 && (
                                                    <ColorDropdown
                                                        label='Colores dispoibles: '
                                                        colors={product.stockColores}
                                                        selectedColor={selectedColor || ''}
                                                        onChange={(e) => setSelectedColor(e.target.value)}
                                                    />
                                                )}

                                                <strong className='text-[12px] 2xl:text-[16px]'>Imagen:</strong>
                                                <div className="flex justify-center mt-2">
                                                    <div className="w-60 h-60 overflow-hidden relative">
                                                        <Image
                                                            src={imagesToShow[0]?.imagen}
                                                            alt={`Imagen del producto`}
                                                            layout="fill"
                                                            objectFit="cover"
                                                            className="rounded-lg"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-2">
                            <SaveButton
                                onClick={handleSave}
                                isLoading={isLoading}
                                disabled={isLoading}
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProductEditModal;