import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SaveButton from '../../buttons/saveButtonAdmin';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onColorAdded?: () => void;
}

const NewCategory: React.FC<ModalProps> = ({ isOpen, onClose, onColorAdded }) => {
    const [nombre, setNombre] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const inputStyles = "border border-darklight p-2 w-full rounded-[10px] text-sm sm:text-base text-dark dark:bg-darklight dark:text-white dark:border-darklight bg-whitedark focus:outline-none";

    useEffect(() => {
        if (!isOpen) {
            setNombre('');
            setError('');
            setIsSubmitting(false);
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!nombre.trim()) {
            setError('Por favor ingresa el nombre de la categoria');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            const response = await fetch('/api/categorias', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nombre: nombre.trim(),
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al crear la categoría');
            }

            // Reset fields and close modal
            setNombre('');
            onColorAdded && onColorAdded();
            onClose();

            toast.success('Categoria creada correctamente');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="rounded-lg shadow-lg max-w-md w-full">
                <div className="flex items-center justify-between bg-primary text-white p-3 w-full rounded-t-lg">
                    <h2 className="text-xl font-bold">Nueva Categoría</h2>
                    <button
                        onClick={onClose}
                        className="p-2"
                        disabled={isSubmitting}
                    >
                        <Image
                            src="/icons/closeWhite.svg"
                            alt="Cerrar"
                            width={24}
                            height={24}
                        />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="bg-white p-4 rounded-b-lg dark:bg-dark">
                    {error && (
                        <div className="w-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}
                    <div className='flex flex-col space-y-2 mb-4'>
                        <label htmlFor="colorName" className='text-dark dark:text-white'>
                            Nombre de la Categoria
                        </label>
                        <input
                            id="colorName"
                            type="text"
                            className={inputStyles}
                            placeholder='Ingresa el nombre de tu categoria'
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="flex justify-end space-x-4 mt-4">
                        <SaveButton text="Crear" loadingText="Creando..." />
                    </div>

                </form>
            </div>
        </div>
    );
};

export default NewCategory;
