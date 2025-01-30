import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Products } from '@/types/products';
import { sanitizeHTML } from '@/utils/sanitizeHTML';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Products | null;
}

// Tipo para las imágenes
type ProductImage = {
    id?: number;
    imagen: string;
    colores?: {
        id: number;
        nombre: string;
        codigo_color: string;
    };
};

const ProductDetailsModal: React.FC<ModalProps> = ({ isOpen, onClose, product }) => {

    const [selectedColor, setSelectedColor] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && product && product.stockColores.length > 0) {
            // Establecer el primer color disponible por defecto cuando el modal se abre
            setSelectedColor(product.stockColores[0].colores.nombre);
        }
    }, [isOpen, product]);

    if (!isOpen || !product) return null;

    // Sanitizar la descripción del producto usando DOMPurify
    const sanitizedDescription = sanitizeHTML(product.descripcion);

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

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="rounded-lg shadow-lg max-w-4xl w-full">
                {/* Encabezado del Modal */}
                <div className="flex items-center justify-between bg-primary text-white p-3 w-full rounded-t-lg">
                    <h2 className="text-xl font-bold">Detalles del Producto</h2>
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
                <div className='bg-white dark:bg-dark p-8 flex rounded-b-lg space-x-5'>
                    {/* Información del producto (izquierda) */}
                    <div className="flex-1 text-dark dark:text-white">
                        <div className="flex flex-col space-y-4">
                            <div className="flex flex-col">
                                <strong>Nombre:</strong>
                                <input type="text" value={product.nombre} className="bg-whitedark p-2 rounded-lg border border-dark focus:outline-none dark:bg-darklight" disabled />
                            </div>
                            <div className="flex flex-col">
                                <strong>Categoría:</strong>
                                <input type="text" value={product.categoriasProductos.nombre} className="bg-whitedark p-2 rounded-lg border border-dark focus:outline-none dark:bg-darklight" disabled />
                            </div>
                            {product.materiales && product.materiales.nombre && (
                                <div className="flex flex-col">
                                    <strong>Material:</strong>
                                    <input type="text" value={product.materiales.nombre} className="bg-whitedark p-2 rounded-lg border border-dark focus:outline-none dark:bg-darklight" disabled />
                                </div>
                            )}
                            {product.marcas && product.marcas.nombre && (
                                <div className="flex flex-col">
                                    <strong>Marca:</strong>
                                    <input type="text" value={product.marcas.nombre} className="bg-whitedark p-2 rounded-lg border border-dark focus:outline-none dark:bg-darklight" disabled />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className={`flex flex-col ${product.stockColores.length === 0 && imagesToShow.length === 0 ? 'flex-1' : 'flex-1/2'} text-dark dark:text-white`}>
                        <div className="flex flex-col space-y-1">
                            <div className="descripcion-producto">
                                <h3 className="text-xl font-bold mb-2">Descripción</h3>
                                <div
                                    className="proceso-quill space-y-2"
                                    dangerouslySetInnerHTML={{
                                        __html: sanitizedDescription,
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Colores e imágenes (derecha) */}
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

                                <h3 className="mt-2 font-semibold">Imagen:</h3>
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
            </div>
        </div>
    );
};

export default ProductDetailsModal;