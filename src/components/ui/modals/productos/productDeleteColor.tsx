'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Image from 'next/image';

interface Color {
    id: number;
    nombre: string;
    codigo_color: string;
}

interface ImageColor {
    id: number;
    id_color: number;
    imagen: string;
}

interface DeleteColorModalProps {
    isOpen: boolean;
    onClose: () => void;
    productId: number;
    onColorDelete: () => void;
}

const DeleteColorModal = ({ isOpen, onClose, productId, onColorDelete }: DeleteColorModalProps) => {
    const [colors, setColors] = useState<Color[]>([]);
    const [selectedColor, setSelectedColor] = useState<string>('');
    const [colorImages, setColorImages] = useState<ImageColor[]>([]);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [selectedImageData, setSelectedImageData] = useState<ImageColor | null>(null);

    useEffect(() => {
        if (!isOpen || !productId) return;

        const fetchColors = async () => {
            try {
                const response = await fetch(`/api/productos/${productId}`);
                if (!response.ok) {
                    throw new Error('Error al obtener los colores');
                }
                const data = await response.json();

                const imageColors = data.imagenesColores?.map((item: any) => item.colores) || [];
                const stockColors = data.stockColores?.map((item: any) => item.colores) || [];
                const images = data.imagenesColores?.map((item: any) => ({
                    id: item.id,
                    id_color: item.id_color,
                    imagen: item.imagen
                })) || [];

                const allColors = [...imageColors, ...stockColors];
                const uniqueColors = Array.from(new Map(allColors.map((color) => [color.id, color])).values());

                setColors(uniqueColors);
                setColorImages(images);
            } catch (error) {
                console.error('Error:', error);
                toast.error('No se pudieron cargar los colores');
            }
        };

        fetchColors();
    }, [isOpen, productId]);

    const handleColorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const colorId = e.target.value;
        setSelectedColor(colorId);

        const foundImage = colorImages.find((img) => img.id_color.toString() === colorId);
        if (foundImage) {
            setSelectedImage(foundImage.imagen);
            setSelectedImageData(foundImage);
        } else {
            setSelectedImage(null);
            setSelectedImageData(null);
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

    const handleDeleteColor = async () => {
        if (!selectedColor || !selectedImageData) {
            toast.error('Por favor, seleccione un color para eliminar.');
            return;
        }

        try {
            // Elimina el color de la base de datos
            const colorResponse = await fetch(`/api/imagenescolores/${selectedColor}?id_producto=${productId}`, {
                method: 'DELETE',
            });

            if (!colorResponse.ok) {
                throw new Error('No se pudo eliminar el color.');
            }

            // Eliminar el archivo guardado localmente
            if (selectedImageData.imagen) {
                await deleteImageFile(selectedImageData.imagen);
            }

            toast.success('Color eliminado correctamente');
            onColorDelete();
            onClose();
        } catch (error: any) {
            console.error('Error al eliminar:', error);
            toast.error('Error al eliminar el color y/o imagen.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="rounded-lg shadow-lg max-w-md w-full">
                <div className="flex items-center justify-between bg-primary text-white p-3 w-full rounded-t-lg">
                    <h2 className="text-xl font-bold">Eliminar colores del Producto</h2>
                    <button onClick={onClose} className="text-xl text-gray-500 ml-4">
                        <Image src={`/icons/closeWhite.svg`} alt="Close" width={24} height={24} />
                    </button>
                </div>

                <div className="bg-white dark:bg-dark p-8 flex flex-col rounded-b-lg">
                    <form className="w-full space-y-4">
                        <div className="space-y-2 text-dark dark:text-white">
                            <strong> Colores: </strong>
                            <select
                                value={selectedColor}
                                onChange={handleColorChange}
                                className="w-full mt-2 p-2 border border-dark rounded bg-white dark:bg-darklight dark:text-white focus:outline-none"
                            >
                                <option value="">Seleccione un color</option>
                                {colors.map((color) => (
                                    <option key={color.id} value={color.id}>
                                        {color.nombre} - {color.codigo_color}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {selectedImage && (
                            <div className="flex justify-center mt-4">
                                <Image
                                    src={selectedImage}
                                    alt="Color seleccionado"
                                    width={150}
                                    height={150}
                                    className="rounded-lg shadow-md border border-gray-300"
                                />
                            </div>
                        )}

                        <div className="mt-4 flex justify-center">
                            <button
                                type="button"
                                onClick={handleDeleteColor}
                                className="px-6 py-2 bg-primary text-white rounded-md hover:bg-secondary focus:outline-none"
                            >
                                Eliminar Color
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default DeleteColorModal;