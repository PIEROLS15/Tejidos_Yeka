import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { toast } from 'react-toastify';
import SaveButton from '../../buttons/saveButtonAdmin';
import InputAdmin from '../../inputAdmin';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onMaterialAdded?: () => void;
}

const NewMaterial: React.FC<ModalProps> = ({ isOpen, onClose, onMaterialAdded }) => {
    const [nombre, setNombre] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

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
            setError('Por favor ingresa el nombre del material');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {

            const response = await fetch('/api/materiales', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nombre: nombre.trim(),
                })
            });

            const data = await response.json();

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al crear la marca');
            }

            // Reset fields and close modal
            setNombre('');
            onMaterialAdded && onMaterialAdded();
            onClose();

            toast.success('Marca creada correctamente');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    const inputStyles =
        "border border-darklight p-2 w-full rounded-[10px] text-[12px] 2xl:text-[16px] text-dark bg-whitedark focus:outline-none dark:bg-darklight dark:text-white dark:border-white"

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="rounded-lg shadow-lg max-w-md w-full">
                <div className="flex items-center justify-between bg-primary text-white p-3 w-full rounded-t-lg">
                    <h2 className="text-xl font-bold">Nuevo Material</h2>
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
                        <InputAdmin label='Nombre del material' placeholder='Ingresa el nuevo material' value={nombre} inputStyles={inputStyles} onChange={(e) => setNombre(e.target.value)} />
                    </div>

                    <div className="flex justify-end space-x-4 mt-4">
                        <SaveButton text="Crear" loadingText="Creando..." />
                    </div>

                </form>
            </div>
        </div>
    );
};

export default NewMaterial;