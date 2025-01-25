import React, { useState } from 'react';
import Image from 'next/image';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onColorAdded?: () => void;
}

const ColorModal: React.FC<ModalProps> = ({ isOpen, onClose, onColorAdded }) => {
    const [nombre, setNombre] = useState('');
    const [codigoColor, setCodigoColor] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const inputStyles = "border border-darklight p-2 w-full rounded-[10px] text-sm sm:text-base text-dark dark:bg-darklight dark:text-white dark:border-darklight bg-whitedark focus:outline-none";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!nombre.trim() || !codigoColor.trim()) {
            setError('Todos los campos son obligatorios');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            const response = await fetch('/api/colores', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nombre: nombre.trim(),
                    codigo_color: codigoColor.trim()
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al crear el color');
            }

            // Reset fields and close modal
            setNombre('');
            setCodigoColor('');
            onColorAdded && onColorAdded();
            onClose();

            // Show success toast
            toast.success('Color creado correctamente');
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
                    <h2 className="text-xl font-bold">Nuevo Color</h2>
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
                        <div className="text-red-500 mb-4 text-center">
                            {error}
                        </div>
                    )}
                    <div className='flex flex-col space-y-2 mb-4'>
                        <label htmlFor="colorName" className='text-dark dark:text-white'>
                            Nombre del Color
                        </label>
                        <input
                            id="colorName"
                            type="text"
                            className={inputStyles}
                            placeholder='Ingresa el nombre de tu color'
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            disabled={isSubmitting}
                            required
                        />
                    </div>
                    <div className='flex flex-col space-y-2'>
                        <label htmlFor="colorCode" className='text-dark dark:text-white'>
                            Código del color
                        </label>
                        <input
                            id="colorCode"
                            type="text"
                            className={inputStyles}
                            placeholder='Ingresa el codigo del color'
                            value={codigoColor}
                            onChange={(e) => setCodigoColor(e.target.value)}
                            disabled={isSubmitting}
                            required
                        />
                    </div>
                    <div className="flex justify-end space-x-4 mt-4">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-primary hover:bg-secondary text-white rounded-lg"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Creando...' : 'Crear'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ColorModal;
