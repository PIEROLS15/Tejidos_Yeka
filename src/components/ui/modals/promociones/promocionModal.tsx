import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

interface ModalPropsPromo {
    isOpen: boolean;
    onClose: () => void;
    onColorAdded?: () => void;
}

const PromocionModal: React.FC<ModalPropsPromo> = ({ isOpen, onClose, onColorAdded }) => {
    const [nombre, setNombre] = useState('');
    const [porcentaje_descuento, setPorcentajeDescuento] = useState('');
    const [fecha_inicio, setFechaInicio] = useState<Date | null>(null);
    const [fecha_fin, setFechaFin] = useState<Date | null>(null);
    const [productos, setProductos] = useState([]);
    const [id_producto, setIdProducto] = useState<number | null>(null);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const inputStyles = "border border-darklight p-2 w-full rounded-[10px] text-sm sm:text-base text-dark dark:bg-darklight dark:text-white dark:border-darklight bg-whitedark focus:outline-none";

    useEffect(() => {
        // Obtener los productos de la API
        const fetchProductos = async () => {
            try {
                const response = await fetch('/api/productos');
                if (response.ok) {
                    const data = await response.json();
                    setProductos(data);
                } else {
                    throw new Error('Error al obtener los productos');
                }
            } catch (error) {
                console.error(error);
                setError('Ocurrió un error al obtener los productos');
            }
        };

        if (isOpen) {
            fetchProductos();
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!nombre.trim() || !porcentaje_descuento.trim() || !fecha_inicio || !fecha_fin || !id_producto) {
            setError('Todos los campos son obligatorios');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            const response = await fetch('/api/promociones', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nombre: nombre.trim(),
                    porcentaje_descuento: parseFloat(porcentaje_descuento.trim()),
                    fecha_inicio: fecha_inicio.toISOString(),
                    fecha_fin: fecha_fin.toISOString(),
                    id_producto,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al crear la promoción');
            }

            setNombre('');
            setPorcentajeDescuento('');
            setFechaInicio(null);
            setFechaFin(null);
            setIdProducto(null);
            onColorAdded && onColorAdded();
            onClose();

            toast.success('Promoción creada correctamente');
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
                    <h2 className="text-xl font-bold">Nueva Promoción</h2>
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
                    <div className="flex flex-col space-y-2 mb-4">
                        <label htmlFor="nombre" className="text-dark dark:text-white">
                            Nombre de la promoción
                        </label>
                        <input
                            id="nombre"
                            type="text"
                            className={inputStyles}
                            placeholder="Ingresa el nombre de la promoción"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            disabled={isSubmitting}
                            required
                        />
                    </div>

                    <div className="flex flex-col space-y-2 mb-4">
                        <label htmlFor="porcentaje_descuento" className="text-dark dark:text-white">
                            Porcentaje de Descuento
                        </label>
                        <input
                            id="porcentaje_descuento"
                            type="number"
                            className={inputStyles}
                            placeholder="Ingresa el porcentaje de descuento"
                            value={porcentaje_descuento}
                            onChange={(e) => setPorcentajeDescuento(e.target.value)}
                            disabled={isSubmitting}
                            required
                        />
                    </div>

                    <div className='flex flex-row space-x-3'>
                        <div className="flex flex-col space-y-2 mb-4">
                            <label htmlFor="fecha_inicio" className="text-dark dark:text-white">
                                Fecha de inicio
                            </label>
                            <DatePicker
                                selected={fecha_inicio}
                                onChange={(date: Date | null) => setFechaInicio(date)}
                                className={inputStyles}
                                dateFormat="yyyy-MM-dd"
                                required
                            />
                        </div>

                        <div className="flex flex-col space-y-2 mb-4">
                            <label htmlFor="fecha_fin" className="text-dark dark:text-white">
                                Fecha de fin
                            </label>
                            <DatePicker
                                selected={fecha_fin}
                                onChange={(date: Date | null) => setFechaFin(date)}
                                className={inputStyles}
                                dateFormat="yyyy-MM-dd"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex flex-col space-y-2 mb-4">
                        <label htmlFor="producto" className="text-dark dark:text-white">
                            Selecciona un producto
                        </label>
                        <select
                            id="producto"
                            value={id_producto || ''}
                            onChange={(e) => setIdProducto(parseInt(e.target.value))}
                            className={inputStyles}
                            disabled={isSubmitting}
                            required
                        >
                            <option value="">Seleccione un producto</option>
                            {productos.map((producto: any) => (
                                <option key={producto.id} value={producto.id}>
                                    {producto.nombre}
                                </option>
                            ))}
                        </select>
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

export default PromocionModal;
