'use client'

import Loader from '@/components/loader';
import ReusableTable from '@/components/ui/tables'
import ProductDetailsModal from '@/components/ui/modals/productos/productDetails';
import React, { useEffect, useState } from 'react';
import { FaEye, FaEdit } from "react-icons/fa";

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
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    const openModal = (product: Products) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedProduct(null);
    };

    const tableData = productList.map((product) => ({
        id: product.id,
        nombre: product.nombre,
        categoria: product.categoriasProductos.nombre,
        materiales: product.materiales.nombre,
        marca: product.marcas.nombre,
        precio: 'S/ ' + product.precio,
        totalColores: product.stockColores.length,
        acciones: (
            <div className="flex space-x-2 justify-center items-center">
                <button
                    onClick={() => openModal(product)}
                    className="bg-[#0674A2] p-2 rounded-lg text-white flex items-center"
                >
                    <FaEye className="mr-2" />
                    Ver
                </button>
                <button className="bg-[#28A745] p-2 rounded-lg text-white flex items-center">
                    <FaEdit className="mr-2" />
                    Editar
                </button>
            </div>
        )
    }));

    const headers = ["Id", "Nombre", "Categoria", "Materiales", "Marca", "Precio", "Total Colores", "Acciones"];

    return (
        <div>
            <Loader duration={1000} />
            <ReusableTable headers={headers} data={tableData} itemsPerPage={5} />

            <ProductDetailsModal
                isOpen={isModalOpen}
                onClose={closeModal}
                product={selectedProduct}
            />
        </div>
    );
}

export default ProductsTable;