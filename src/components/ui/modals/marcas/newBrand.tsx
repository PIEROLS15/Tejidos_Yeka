import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { toast } from 'react-toastify';
import SaveButton from '../../buttons/saveButtonAdmin';
import InputAdmin from '../../inputAdmin';
import ImageUpload from '@/components/ui/imageUpload';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onColorAdded?: () => void;
}

const NewBrand: React.FC<ModalProps> = ({ isOpen, onClose, onColorAdded }) => {
    const [nombre, setNombre] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');

    useEffect(() => {
        if (!isOpen) {
            setNombre('');
            setError('');
            setIsSubmitting(false);
            setImage(null);
            setImagePreview('');
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!nombre.trim()) {
            setError('Por favor ingresa el nombre de la categoria');
            return;
        }
        if (!image) {
            setError('Por favor seleccione una imagen');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
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

            const response = await fetch('/api/marcas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nombre: nombre.trim(),
                    logo: imagePath
                })
            });

            const data = await response.json();

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al crear la marca');
            }

            if (!response.ok) {
                try {
                    await fetch(`/api/upload/${fileName}`, { method: 'DELETE' });
                } catch (deleteError) {
                    console.error('Error al eliminar la imagen:', deleteError);
                }
                throw new Error(data.error || 'Error al agregar la marca');
            }

            // Reset fields and close modal
            setNombre('');
            onColorAdded && onColorAdded();
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
                    <h2 className="text-xl font-bold">Nueva Marca</h2>
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
                        <InputAdmin label='Nombre de la marca' placeholder='Ingresa el nombre de la nueva marca' value={nombre} inputStyles={inputStyles} onChange={(e) => setNombre(e.target.value)} />
                    </div>

                    <ImageUpload
                        label='Logo'
                        onImageUpload={(file) => setImage(file)}
                        imagePreview={imagePreview}
                        setImagePreview={setImagePreview}
                    />

                    <div className="flex justify-end space-x-4 mt-4">
                        <SaveButton text="Crear" loadingText="Creando..." />
                    </div>

                </form>
            </div>
        </div>
    );
};

export default NewBrand;