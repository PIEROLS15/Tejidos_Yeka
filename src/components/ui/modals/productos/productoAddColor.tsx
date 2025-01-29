'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Image from 'next/image';

interface Color {
    id: number;
    nombre: string;
    codigo_color: string;
}

interface AddColorModalProps {
    isOpen: boolean;
    onClose: () => void;
    productId: number;
    onColorAdded: () => void;
}

const AddColorModal = ({ isOpen, onClose, productId, onColorAdded }: AddColorModalProps) => {
    const [colors, setColors] = useState<Color[]>([]);
    const [selectedColor, setSelectedColor] = useState<string>('');
    const [cantidad, setCantidad] = useState<string>('');
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>('');

    // Obtenemos los colores
    useEffect(() => {
        const fetchColors = async () => {
            try {
                const response = await fetch('/api/colores');
                if (!response.ok) throw new Error('Failed to fetch colors');
                const data = await response.json();
                setColors(data);
            } catch (error) {
                setError('Error al cargar los colores');
            }
        };

        if (isOpen) {
            fetchColors();
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validaciones iniciales
        if (!image) {
            setError('Por favor seleccione una imagen');
            return;
        }
        if (!selectedColor) {
            setError('Por favor seleccione un color');
            return;
        }
        if (!cantidad || parseInt(cantidad) <= 0) {
            setError('Por favor ingrese una cantidad válida');
            return;
        }

        setIsLoading(true);

        try {
            // Primero preparamos los datos a enviar
            const formData = new FormData();
            formData.append('file', image);

            // Subimos la imagen
            const uploadResponse = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            if (!uploadResponse.ok) {
                throw new Error('Error al subir la imagen');
            }

            const { fileName } = await uploadResponse.json();
            const imagePath = `/images/${fileName}`;

            // Preparar los datos para crear el color
            const colorData = {
                imagen: imagePath,
                id_producto: productId,
                id_color: parseInt(selectedColor),
                cantidad: parseInt(cantidad)
            };

            // Intentar crear el color con la imagen
            const response = await fetch('/api/imagenescolores', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(colorData)
            });

            const data = await response.json();

            if (!response.ok) {
                try {
                    await fetch(`/api/upload/${fileName}`, { method: 'DELETE' });
                } catch (deleteError) {
                    console.error('Error al eliminar la imagen:', deleteError);
                }
                throw new Error(data.error || 'Error al agregar el color');
            }

            // Si todo sale bien
            toast.success('Color agregado correctamente');
            onClose();
            onColorAdded();

            // Limpiar el formulario
            setSelectedColor('');
            setCantidad('');
            setImage(null);
            setImagePreview('');
            setError('');

        } catch (error: any) {
            setError(error.message);
            setImagePreview('');
            setImage(null);

        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="rounded-lg shadow-lg max-w-md w-full">
                {/* Encabezado del Modal */}
                <div className="flex items-center justify-between bg-primary text-white p-3 w-full rounded-t-lg">
                    <h2 className="text-xl font-bold">Agregar colores al Producto</h2>
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

                <div className="bg-white dark:bg-dark p-8 flex flex-col rounded-b-lg ">
                    {error && (
                        <div className="w-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="w-full space-y-4">
                        <div className="space-y-2 text-dark dark:text-white">
                            <strong> Color: </strong>
                            <select
                                value={selectedColor}
                                onChange={(e) => setSelectedColor(e.target.value)}
                                className="w-full mt-2 p-2 border border-dark rounded bg-whitedark dark:bg-darklight dark:text-white focus:outline-none "
                            >
                                <option value="">Seleccione un color</option>
                                {colors.map((color) => (
                                    <option key={color.id} value={color.id}>
                                        {color.nombre} - {color.codigo_color}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2 text-dark dark:text-white">
                            <strong> Cantidad: </strong>
                            <input
                                type="number"
                                value={cantidad}
                                onChange={(e) => setCantidad(e.target.value)}
                                className="w-full bg-whitedark p-2 rounded-lg border border-dark focus:outline-none dark:bg-darklight dark:text-white"
                                min="1"
                            />
                        </div>

                        <div className="space-y-2 text-dark dark:text-white">
                            <strong> Imagen: </strong>
                            <input
                                type="file"
                                onChange={(e) => {
                                    const file = e.target.files?.[0] || null;
                                    setImage(file);

                                    // Crear una URL de previsualización
                                    if (file) {
                                        const previewURL = URL.createObjectURL(file);
                                        setImagePreview(previewURL);
                                    } else {
                                        setImagePreview('');
                                    }
                                }}
                                accept="image/*"
                                className="w-full"
                            />

                            {imagePreview && (
                                <div className="flex justify-center">
                                    <Image
                                        src={imagePreview}
                                        alt="Preview"
                                        width={200}
                                        height={200}
                                        className="mt-2 max-w-full h-40 object-contain"
                                        unoptimized
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end space-x-2 mt-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary disabled:opacity-50"
                            >
                                {isLoading ? 'Guardando...' : 'Guardar'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddColorModal;
