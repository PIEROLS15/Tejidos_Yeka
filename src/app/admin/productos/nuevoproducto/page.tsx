'use client'

import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import Image from 'next/image';
import 'react-quill/dist/quill.snow.css';
import dynamic from 'next/dynamic';
import Loader from '@/components/loader';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

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

const NuevoProducto = () => {
    const formRef = useRef<HTMLFormElement>(null);
    const [categorias, setCategorias] = useState<Categorias[]>([]);
    const [selectedCategorias, setSelectedCategorias] = useState<string>('');
    const [materiales, setMateriales] = useState<Materiales[]>([]);
    const [selectedMateriales, setSelectedMateriales] = useState<string>('');
    const [marcas, setMarcas] = useState<Marcas[]>([]);
    const [selectedMarcas, setSelectedMarcas] = useState<string>('');
    const [nombre, setNombre] = useState<string>('');
    const [precio, setPrecio] = useState<number | ''>('');
    const [stock, setStock] = useState<number | '' | null>('');
    const [descripcion, setDescripcion] = useState<string>('');
    const [imagen, setImagen] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [mensaje, setMensaje] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    // Cleanup function for image preview URL
    useEffect(() => {
        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    // Obtener categorías
    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const response = await fetch('/api/categorias');
                if (!response.ok) throw new Error('Failed to fetch categories');
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
                if (!response.ok) throw new Error('Failed to fetch materials');
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
                if (!response.ok) throw new Error('Failed to fetch brands');
                const data = await response.json();
                setMarcas(data);
            } catch (error) {
                setError('Error al cargar las marcas');
            }
        };
        fetchMarcas();
    }, []);

    const clearForm = () => {
        setNombre('');
        setPrecio('');
        setStock('');
        setSelectedCategorias('');
        setSelectedMateriales('');
        setSelectedMarcas('');
        setDescripcion('');
        setImagen(null);
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
            setImagePreview('');
        }
        // Resetear el formulario para limpiar el input file
        if (formRef.current) {
            formRef.current.reset();
        }
    };

    // Función para enviar los datos al backend
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMensaje('');
        setError('');

        // Validación
        if (!nombre || !precio || !selectedCategorias || !descripcion) {
            setError('Todos los campos son obligatorios');
            return;
        }

        try {
            // Primero preparamos los datos a enviar
            const formData = new FormData();

            if (imagen) {
                formData.append('file', imagen);

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

                // Crear objeto con los datos, incluyendo la imagen si existe
                const nuevoProducto = {
                    nombre,
                    precio: Number(precio),
                    stock: Number(stock) || null,
                    id_categoria: Number(selectedCategorias),
                    id_materiales: Number(selectedMateriales) || null,
                    id_marcas: Number(selectedMarcas) || null,
                    descripcion,
                    imagen_principal: imagePath,
                };

                // Enviamos el producto a la API
                const response = await fetch('/api/productos', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(nuevoProducto),
                });

                const data = await response.json();

                if (!response.ok) {
                    try {
                        if (fileName) {
                            await fetch(`/api/upload/${fileName}`, { method: 'DELETE' });
                        }
                    } catch (deleteError) {
                        console.error('Error al eliminar la imagen:', deleteError);
                    }
                    throw new Error(data.error || 'Error al enviar el producto');
                }

                toast.success('Producto creado correctamente');
                clearForm();
            } else {
                // Si no hay imagen, enviamos los datos sin imagen
                const nuevoProducto = {
                    nombre,
                    precio: Number(precio),
                    stock: Number(stock) || null,
                    id_categoria: Number(selectedCategorias),
                    id_materiales: Number(selectedMateriales) || null,
                    id_marcas: Number(selectedMarcas) || null,
                    descripcion,
                    imagen_principal: null,
                };

                // Enviamos el producto a la API
                const response = await fetch('/api/productos', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(nuevoProducto),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Error al enviar el producto');
                }

                toast.success('Producto creado correctamente');
                clearForm();
            }

        } catch (error) {
            setError('No se pudo crear el producto');
        }
    };


    const selectStyles = "w-full mt-2 p-3 border border-dark rounded bg-white dark:bg-dark dark:text-white dark:border-white focus:outline-none ";

    return (
        <div>
            <Loader duration={1000} />
            <h1 className='text-center text-dark text-3xl font-extrabold mb-10 dark:text-white'>Crea un nuevo producto</h1>

            {error && (
                <div className="w-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center">
                    {error}
                </div>
            )}

            <form ref={formRef} onSubmit={handleSubmit} className='space-y-5'>
                <div className='flex flex-row space-x-5'>
                    <div className="space-y-2 text-dark dark:text-white w-full">
                        <strong> Nombre del Producto: </strong>
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            className={selectStyles}
                        />
                    </div>
                    <div className="space-y-2 text-dark dark:text-white w-full">
                        <strong> Precio del Producto: </strong>
                        <input
                            type="number"
                            value={precio}
                            onChange={(e) => setPrecio(Number(e.target.value))}
                            className={selectStyles}
                            min="0"
                        />
                    </div>
                    <div className="space-y-2 text-dark dark:text-white w-full">
                        <strong> Stock del Producto: </strong>
                        <input
                            type="number"
                            value={stock === null ? '' : stock}
                            onChange={(e) => {
                                const value = e.target.value === '' ? null : Number(e.target.value);
                                setStock(value);
                            }}
                            className={selectStyles}
                            min="0"
                        />
                    </div>
                </div>

                <div className='flex flex-row space-x-5'>
                    <div className="space-y-2 text-dark dark:text-white w-full">
                        <strong> Categoría: </strong>
                        <select
                            value={selectedCategorias}
                            onChange={(e) => setSelectedCategorias(e.target.value)}
                            className={selectStyles}
                        >
                            <option value="">Seleccione una categoría</option>
                            {categorias.map((categoria) => (
                                <option key={categoria.id} value={categoria.id}>
                                    {categoria.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2 text-dark dark:text-white w-full">
                        <strong> Materiales: </strong>
                        <select
                            value={selectedMateriales}
                            onChange={(e) => setSelectedMateriales(e.target.value)}
                            className={selectStyles}
                        >
                            <option value="">Seleccione un material</option>
                            {materiales.map((material) => (
                                <option key={material.id} value={material.id}>
                                    {material.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2 text-dark dark:text-white w-full">
                        <strong> Marcas: </strong>
                        <select
                            value={selectedMarcas}
                            onChange={(e) => setSelectedMarcas(e.target.value)}
                            className={selectStyles}
                        >
                            <option value="">Seleccione una marca</option>
                            {marcas.map((marca) => (
                                <option key={marca.id} value={marca.id}>
                                    {marca.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className='flex flex-row space-x-5'>
                    <div className="space-y-2 text-dark dark:text-white w-full">
                        <strong> Descripción del Producto: </strong>
                        <ReactQuill
                            value={descripcion}
                            onChange={setDescripcion}
                            className="w-full mt-2 p-3 border border-dark rounded bg-white dark:bg-dark dark:text-white dark:border-white focus:outline-none"
                        />
                    </div>
                    <div className="space-y-2 text-dark dark:text-white w-full">
                        <strong> Imagen : </strong>
                        <input
                            type="file"
                            onChange={(e) => {
                                const file = e.target.files?.[0] || null;
                                setImagen(file);

                                if (imagePreview) {
                                    URL.revokeObjectURL(imagePreview);
                                }

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
                </div>

                <div className="flex justify-center">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary disabled:opacity-50"
                    >
                        {isLoading ? 'Creando...' : 'Crear Producto'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default NuevoProducto;