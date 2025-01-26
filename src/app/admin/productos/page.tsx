'use client'

import Loader from '@/components/loader';
import ReusableTable from '@/components/ui/tables'
import ProductDetailsModal from '@/components/ui/modals/productos/productDetails';
import React, { useEffect, useState } from 'react';
import { FaEye, FaEdit } from "react-icons/fa";
import ProductEditModal from '../../../components/ui/modals/productos/productEdit';

interface Products {
    id: number;
    nombre: string;
    descripcion: string;
    imagen_principal: string;
    precio: string;
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
}

const ProductsTable = () => {
    const [productList, setProductList] = useState<Products[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Products | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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

    // Funcion para sumar el stock total del producto
    const calculateTotalStock = (stockColores: Products['stockColores']) => {
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

    const tableData = productList.map((product) => ({
        id: product.id,
        nombre: product.nombre,
        categoria: product.categoriasProductos.nombre,
        materiales: product.materiales.nombre,
        marca: product.marcas.nombre,
        precio: 'S/ ' + product.precio,
        totalColores: product.stockColores.length,
        totalStock: calculateTotalStock(product.stockColores),
        acciones: (
            <div className="flex space-x-2 justify-center items-center">
                <button
                    onClick={() => openDetailsModal(product)}
                    className="bg-[#0674A2] p-2 rounded-lg text-white flex items-center"
                >
                    <FaEye className="mr-2" />
                    Ver
                </button>
                <button
                    onClick={() => openEditModal(product)}
                    className="bg-[#28A745] p-2 rounded-lg text-white flex items-center"
                >
                    <FaEdit className="mr-2" />
                    Editar
                </button>
            </div>
        )
    }));

    const headers = ["Id", "Nombre", "Categoria", "Materiales", "Marca", "Precio", "Total Colores", "Stock Total", "Acciones"];

    return (
        <div>
            <Loader duration={1000} />
            <ReusableTable headers={headers} data={tableData} itemsPerPage={5} />

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
        </div>
    );
}
export default ProductsTable;