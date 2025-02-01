import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Products } from '@/types/products';
import { sanitizeHTML } from '@/utils/sanitizeHTML';
import ColorDropdown from '@/components/ui/dropdowns/dropdownColorAdmin';
import InputAdmin from '@/components/ui/inputAdmin';

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

    const inputStyles =
        "border border-darklight p-2 w-full rounded-[10px] text-[12px] 2xl:text-[16px] text-dark bg-whitedark focus:outline-none dark:bg-darklight dark:text-white dark:border-white"

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
                    {/* Información del producto*/}
                    <div className="flex-1 text-dark dark:text-white">
                        <div className="flex flex-col space-y-4">
                            <InputAdmin label="Nombre" value={product.nombre} inputStyles={inputStyles} disabled />

                            <InputAdmin label="Categoría" value={product.categoriasProductos.nombre} inputStyles={inputStyles} disabled />

                            {product.materiales && product.materiales.nombre && (
                                <InputAdmin label="Material" value={product.materiales.nombre} inputStyles={inputStyles} disabled />
                            )}

                            {product.marcas && product.marcas.nombre && (
                                <InputAdmin label="Marca" value={product.marcas.nombre} inputStyles={inputStyles} disabled />
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

                    {/* Colores e imágenes */}
                    {(product.stockColores.length > 0 || imagesToShow.length > 0) && (
                        <div className="flex-1">
                            <div className='text-dark dark:text-white'>
                                {product.stockColores.length > 0 && (
                                    <ColorDropdown
                                        label='Colores:'
                                        colors={product.stockColores}
                                        selectedColor={selectedColor || ''}
                                        onChange={(e) => setSelectedColor(e.target.value)}
                                    />
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
                                                className="rounded-lg"
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