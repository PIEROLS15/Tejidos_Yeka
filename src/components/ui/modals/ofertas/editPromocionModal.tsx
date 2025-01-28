import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { toast } from 'react-toastify';
import Image from 'next/image';

interface EditPromocionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPromocionUpdated: () => void;
    promocion: {
        id: number;
        id_producto: number;
        status: boolean;
        promociones: {
            id: number;
            nombre: string;
            porcentaje_descuento: number;
            fecha_inicio: Date;
            fecha_fin: Date;
        };
    } | null;
}

interface Producto {
    id: number;
    nombre: string;
}

const EditPromocionModal = ({ isOpen, onClose, onPromocionUpdated, promocion }: EditPromocionModalProps) => {
    const [nombre, setNombre] = useState('');
    const [porcentajeDescuento, setPorcentajeDescuento] = useState(0);
    const [fechaInicio, setFechaInicio] = useState<Date | null>(new Date());
    const [fechaFin, setFechaFin] = useState<Date | null>(new Date());
    const [status, setStatus] = useState(true);
    const [idProducto, setIdProducto] = useState(0);
    const [productos, setProductos] = useState<Producto[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const inputStyles = "border border-darklight p-2 w-full rounded-[10px] text-sm sm:text-base text-dark dark:bg-darklight dark:text-white dark:border-darklight bg-whitedark focus:outline-none";

    useEffect(() => {
        if (promocion) {
            setNombre(promocion.promociones.nombre);
            setPorcentajeDescuento(promocion.promociones.porcentaje_descuento);
            setFechaInicio(new Date(promocion.promociones.fecha_inicio));
            setFechaFin(new Date(promocion.promociones.fecha_fin));
            setStatus(promocion.status);
            setIdProducto(promocion.id_producto);
        }
    }, [promocion]);

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const response = await fetch('/api/productos');
                if (response.ok) {
                    const data = await response.json();
                    setProductos(data);
                }
            } catch (error) {
                console.error('Error fetching productos:', error);
            }
        };

        if (isOpen) {
            fetchProductos();
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!fechaInicio || !fechaFin) {
            alert('Por favor seleccione las fechas');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/ofertas', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: promocion?.promociones.id,
                    nombre,
                    porcentaje_descuento: porcentajeDescuento,
                    fecha_inicio: fechaInicio,
                    fecha_fin: fechaFin,
                    status,
                    id_producto: idProducto,
                }),
            });

            if (response.ok) {
                onPromocionUpdated();
                onClose();
                toast.success('Promoción actualizada correctamente');
            } else {
                console.error('Error updating promotion');
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="rounded-lg shadow-lg max-w-md w-full">
                <div className="flex items-center justify-between bg-primary text-white p-3 w-full rounded-t-lg">
                    <h2 className="text-xl font-bold">Editar Promoción</h2>
                    <button
                        onClick={onClose}
                        className="p-2"
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
                    <div className="flex flex-col space-y-2 mb-4">
                        <label className="text-dark dark:text-white">Nombre:</label>
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            className={inputStyles}
                            required
                        />
                    </div>

                    <div className="flex flex-col space-y-2 mb-4">
                        <label className="text-dark dark:text-white">Porcentaje de Descuento:</label>
                        <input
                            type="number"
                            value={porcentajeDescuento}
                            onChange={(e) => setPorcentajeDescuento(Number(e.target.value))}
                            className={inputStyles}
                            required
                        />
                    </div>

                    <div className='flex flex-row space-x-3'>
                        <div className="flex flex-col space-y-2 mb-4">
                            <label className="text-dark dark:text-white">Fecha Inicio:</label>
                            <DatePicker
                                selected={fechaInicio}
                                onChange={(date: Date | null) => setFechaInicio(date)}
                                className={inputStyles}
                                dateFormat="dd/MM/yyyy"
                                required
                            />
                        </div>

                        <div className="flex flex-col space-y-2 mb-4">
                            <label className="text-dark dark:text-white">Fecha Fin:</label>
                            <DatePicker
                                selected={fechaFin}
                                onChange={(date: Date | null) => setFechaFin(date)}
                                className={inputStyles}
                                dateFormat="dd/MM/yyyy"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex flex-col space-y-2 mb-4">
                        <label className="text-dark dark:text-white">Estado:</label>
                        <select
                            value={status.toString()}
                            onChange={(e) => setStatus(e.target.value === 'true')}
                            className={inputStyles}
                        >
                            <option value="true">Activo</option>
                            <option value="false">Inactivo</option>
                        </select>
                    </div>

                    <div className="flex flex-col space-y-2 mb-4">
                        <label className="text-dark dark:text-white">Producto:</label>
                        <select
                            value={idProducto || ''}
                            onChange={(e) => setIdProducto(Number(e.target.value))}
                            className={inputStyles}
                            required
                        >
                            <option value="">Seleccionar producto</option>
                            {productos.map((producto) => (
                                <option key={producto.id} value={producto.id}>
                                    {producto.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-end space-x-2 mt-6">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 bg-primary text-white rounded hover:bg-secondary"
                        >
                            {isLoading ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </div>

        </div>
    );
};

export default EditPromocionModal;