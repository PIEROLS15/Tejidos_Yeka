'use client'

import Loader from '@/components/loader';
import ReusableTable from '@/components/ui/tables'
import ProductDetailsModal from '@/components/ui/modals/productos/productDetails';
import React, { useEffect, useState } from 'react';
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { IoMdAddCircle } from "react-icons/io";
import { MdFormatColorReset } from "react-icons/md";
import ProductEditModal from '@/components/ui/modals/productos/productEdit';
import AddColorModal from '@/components/ui/modals/productos/productoAddColor';
import DeleteColorModal from '@/components/ui/modals/productos/productDeleteColor';
import DeleteProductModal from '@/components/ui/modals/productos/productDelete';
import { toast } from 'react-toastify';

interface Products {
    id: number;
    nombre: string;
    descripcion: string;
    imagen_principal: string;
    precio: string;
    stock: number | null;
    categoriasProductos: {
        id: number;
        nombre: string;
    };
    materiales: {
        id: number;
        nombre: string;
    };
    marcas: {
        id: number;
        nombre: string;
        logo: string | null;
    };
    imagenesColores: {
        id: number;
        imagen: string;
        colores: {
            id: number;
            nombre: string;
            codigo_color: string;
        };
    }[];
    stockColores: {
        id: number;
        cantidad: number;
        colores: {
            id: number;
            nombre: string;
            codigo_color: string;
        };
    }[];
    promocionesProductos: {
        id: number;
        id_promocion: number;
        status: boolean;
        promociones: {
            id: number;
            nombre: string;
            porcentaje_descuento: string;
            fecha_inicio: string;
            fecha_fin: string;
        };
    }[];
}

const ProductsTable = () => {
    const [productList, setProductList] = useState<Products[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Products | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddColorModalOpen, setIsAddColorModalOpen] = useState(false);
    const [isDeleteColorModalOpen, setIsDeleteColorModalOpen] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);


    const fetchProducts = async () => {
        try {
            const response = await fetch('/api/productos');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data: Products[] = await response.json();
            setProductList(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const openDetailsModal = (product: Products) => {
        setSelectedProduct(product);
        setIsDetailsModalOpen(true);
    };

    const openEditModal = (product: Products) => {
        setSelectedProduct(product);
        setIsEditModalOpen(true);
    };

    const closeDetailsModal = () => {
        setIsDetailsModalOpen(false);
        setSelectedProduct(null);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedProduct(null);
    };

    const openAddColorModal = (productId: number) => {
        setSelectedProductId(productId);
        setIsAddColorModalOpen(true);
    };

    const closeAddColorModal = () => {
        setIsAddColorModalOpen(false);
        setSelectedProductId(null);
    };

    const openDeleteColorModal = (productId: number) => {
        setSelectedProductId(productId);
        setIsDeleteColorModalOpen(true);
    };

    const closeDeleteColorModal = () => {
        setIsDeleteColorModalOpen(false);
        setSelectedProductId(null);
    };

    const openDeleteModal = (productId: number) => {
        setSelectedProductId(productId);
        const productToDelete = productList.find(product => product.id === productId);
        if (productToDelete) {
            setSelectedProduct(productToDelete);
        }
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setSelectedProduct(null);
    };

    // Funcion para sumar el stock total del producto
    const calculateTotalStock = (stockColores: Products['stockColores'], stock: number | null) => {
        // Si stock no es null, retornar ese valor
        if (stock !== null) {
            return stock;
        }
        // Si stock es null, calcular la suma de stockColores
        return stockColores.reduce((total, stockColor) => total + stockColor.cantidad, 0);
    };

    const handleProductSave = async (updatedProduct: Products) => {
        try {
            const response = await fetch(`/api/productos/${updatedProduct.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedProduct)
            });

            if (!response.ok) {
                throw new Error('Failed to update product');
            }

            // Update the product in the list
            setProductList(prevList =>
                prevList.map(product =>
                    product.id === updatedProduct.id ? updatedProduct : product
                )
            );
        } catch (error) {
            console.error('Error updating product:', error);
        }
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

    const handleDeleteProduct = async () => {
        if (selectedProductId) {
            try {
                // Buscar el producto seleccionado
                const productToDelete = productList.find(product => product.id === selectedProductId);

                if (productToDelete) {

                    // Verificar y eliminar la imagen principal si existe
                    if (productToDelete.imagen_principal) {
                        try {
                            await deleteImageFile(productToDelete.imagen_principal);
                        } catch (error) {
                            console.error('Error al eliminar la imagen principal:', error);
                        }
                    }

                    // Eliminar todas las imágenes de colores
                    if (productToDelete.imagenesColores) {
                        for (const image of productToDelete.imagenesColores) {
                            try {
                                await deleteImageFile(image.imagen);
                            } catch (error) {
                                console.error('Error al eliminar imagen de color:', error);
                            }
                        }
                    }

                    // Eliminar el producto de la base de datos
                    const response = await fetch(`/api/productos/${selectedProductId}`, {
                        method: 'DELETE',
                    });

                    if (!response.ok) {
                        throw new Error('Failed to delete product');
                    }

                    // Actualizar la lista local
                    setProductList(prevList => prevList.filter(product => product.id !== selectedProductId));
                    toast.success('Producto eliminado correctamente');

                    // Cerrar el modal
                    setIsDeleteModalOpen(false);
                    setSelectedProductId(null);
                }
            } catch (error) {
                console.error('Error deleting product:', error);
                toast.error('Error al eliminar el producto');
            }
        }
    };

    const tooltipStyles = "absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 text-sm text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity bg-darklight dark:bg-white dark:text-dark";

    const tableData = productList.map((product) => ({
        nombre: product.nombre,
        categoria: product.categoriasProductos.nombre,
        precio: 'S/ ' + product.precio,
        totalColores: product.imagen_principal && product.stock !== null ? "-" : product.stockColores.length,
        totalStock: calculateTotalStock(product.stockColores, product.stock),
        acciones: (
            <div className="flex space-x-2 justify-center items-center">
                <div className="group relative">
                    <button
                        onClick={() => openDetailsModal(product)}
                        className="bg-[#0674A2] p-2 rounded-lg text-white flex items-center"
                    >
                        <FaEye className='text-xl' />
                    </button>
                    <span className={tooltipStyles}>
                        Ver detalles
                    </span>
                </div>

                <div className="group relative">
                    <button
                        onClick={() => openEditModal(product)}
                        className="bg-[#28A745] p-2 rounded-lg text-white flex items-center"
                    >
                        <FaEdit className='text-xl' />
                    </button>
                    <span className={tooltipStyles}>
                        Editar producto
                    </span>
                </div>

                {product.imagen_principal ? null : (
                    <>
                        <div className="group relative">
                            <button
                                onClick={() => openAddColorModal(product.id)}
                                className="bg-primary p-2 rounded-lg text-white flex items-center"
                            >
                                <IoMdAddCircle className='text-xl' />
                            </button>
                            <span className={tooltipStyles}>
                                Agregar color
                            </span>
                        </div>

                        <div className="group relative">
                            <button
                                onClick={() => openDeleteColorModal(product.id)}
                                className="bg-primary p-2 rounded-lg text-white flex items-center"
                            >
                                <MdFormatColorReset className='text-xl' />
                            </button>
                            <span className={tooltipStyles}>
                                Eliminar color
                            </span>
                        </div>
                    </>
                )}

                <div className="group relative">
                    <button
                        onClick={() => openDeleteModal(product.id)}
                        className="bg-red-500 p-2 rounded-lg text-white flex items-center"
                    >
                        <FaTrash className='text-xl' />
                    </button>
                    <span className={tooltipStyles}>
                        Eliminar producto
                    </span>
                </div>
            </div>
        )
    }));

    const headers = ["Nombre", "Categoria", "Precio", "Total Colores", "Stock Total", "Acciones"];

    return (
        <div>

            <Loader duration={1000} />
            <ReusableTable headers={headers} data={tableData} itemsPerPage={10} />

            <ProductDetailsModal
                isOpen={isDetailsModalOpen}
                onClose={closeDetailsModal}
                product={selectedProduct}
            />

            <ProductEditModal
                isOpen={isEditModalOpen}
                onClose={closeEditModal}
                product={selectedProduct}
                onSave={handleProductSave}
            />

            {selectedProductId && isAddColorModalOpen && (
                <AddColorModal
                    isOpen={isAddColorModalOpen}
                    onClose={closeAddColorModal}
                    productId={selectedProductId}
                    onColorAdded={fetchProducts}
                />
            )}
            {selectedProductId && isDeleteColorModalOpen && (
                <DeleteColorModal
                    isOpen={isDeleteColorModalOpen}
                    onClose={closeDeleteColorModal}
                    productId={selectedProductId}
                    onColorDelete={fetchProducts}
                />
            )}

            {selectedProduct && isDeleteModalOpen && (
                <DeleteProductModal
                    isOpen={isDeleteModalOpen}
                    onClose={closeDeleteModal}
                    product={selectedProduct}
                    onDelete={handleDeleteProduct}
                />
            )}
        </div>
    );
}
export default ProductsTable;