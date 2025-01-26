'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Loader from '@/components/loader';

type Producto = {
    id: number;
    nombre: string;
    descripcion: string;
    imagen_principal: string | null;
    precio: string;
    categoriasProductos: {
        id: number;
        nombre: string;
    };
    materiales: {
        id: number;
        nombre: string;
    };
    marcas: {
        id: number;
        nombre: string;
        logo: string | null;
    };
    imagenesColores: {
        id: number;
        imagen: string;
        colores: {
            id: number;
            nombre: string;
            codigo_color: string;
        };
    }[];
    stockColores: {
        id: number;
        cantidad: number;
        colores: {
            id: number;
            nombre: string;
            codigo_color: string;
        };
    }[];
    promocionesProductos: {
        id: number;
        id_promocion: number;
        status: boolean;
        promociones: {
            id: number;
            nombre: string;
            porcentaje_descuento: string;
            fecha_inicio: string;
            fecha_fin: string;
        };
    }[];
};

const ProductoDetalle = () => {
    const { id } = useParams();
    const [producto, setProducto] = useState<Producto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [imagenSeleccionada, setImagenSeleccionada] = useState<string | null>(null);
    const [colorSeleccionado, setColorSeleccionado] = useState<{ id: number; nombre: string; codigo_color: string } | null>(null);
    const [zoom, setZoom] = useState<boolean>(false);
    const [zoomPosition, setZoomPosition] = useState<{ x: number; y: number }>({ x: 50, y: 50 });

    useEffect(() => {
        const fetchProducto = async () => {
            try {
                const response = await fetch(`/api/productos/${id}`);
                if (!response.ok) {
                    throw new Error('Error al obtener los detalles del producto');
                }
                const data: Producto = await response.json();
                setProducto(data);

                // Setear imagen y color por defecto
                if (data.imagenesColores.length > 0) {
                    setImagenSeleccionada(data.imagenesColores[0].imagen);
                    setColorSeleccionado(data.imagenesColores[0].colores);
                }
            } catch (error: unknown) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError('Error desconocido');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProducto();
    }, [id]);

    // Función para hacer zoom a las imágenes
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        setZoomPosition({ x, y });
    };

    const handleSeleccionarImagen = (imagen: string, color: { id: number; nombre: string; codigo_color: string }) => {
        setImagenSeleccionada(imagen);
        setColorSeleccionado(color);
    };

    // Obtener el precio con descuento si existe una promoción activa
    const getPrecioConDescuento = (precio: string, promociones: Producto['promocionesProductos']) => {
        const promocionActiva = promociones.find(p => p.status);
        if (promocionActiva) {
            const porcentajeDescuento = parseFloat(promocionActiva.promociones.porcentaje_descuento);
            const precioOriginal = parseFloat(precio);
            const precioConDescuento = precioOriginal * (1 - porcentajeDescuento / 100);
            return precioConDescuento.toFixed(2);
        }
        return null;
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <Loader duration={1500} />
            {producto && (
                <div className="px-[10px] max-w-[1200px]">
                    <div className="flex flex-row">
                        {/* Imagen principal */}
                        <div className="w-full md:w-1/2 flex flex-col items-center">
                            <div
                                className="relative w-full max-w-[500px] h-[500px] overflow-hidden border rounded-lg cursor-crosshair"
                                onMouseEnter={() => setZoom(true)}
                                onMouseLeave={() => setZoom(false)}
                                onMouseMove={handleMouseMove}
                            >
                                {imagenSeleccionada && (
                                    <div
                                        className="absolute inset-0 transition-transform duration-200 ease-in-out"
                                        style={{
                                            backgroundImage: `url(${imagenSeleccionada})`,
                                            backgroundSize: zoom ? '200%' : 'contain',
                                            backgroundPosition: zoom ? `${zoomPosition.x}% ${zoomPosition.y}%` : 'center',
                                            backgroundRepeat: 'no-repeat',
                                            width: '100%',
                                            height: '100%',
                                        }}
                                    />
                                )}
                            </div>
                        </div>

                        {/* Características */}
                        <div className="max-w-[50%]">
                            <div className='pl-10 text-dark dark:text-white'>
                                {/* Stock del Producto - Solo el del color seleccionado */}
                                <div>
                                    {producto?.stockColores
                                        .filter(stock => stock.colores.id === colorSeleccionado?.id)
                                        .map(stockColor => (
                                            <div key={stockColor.id} className="flex justify-between mt-2">
                                                <p className="text-xs dark:text-whitedark">Disponibilidad: {stockColor.cantidad} en stock.</p>
                                            </div>
                                        ))}
                                </div>

                                {/* Nombre del Producto */}
                                <div>
                                    <h1 className='text-3xl font-bold'>{producto?.nombre}</h1>
                                </div>

                                {/* Precio del Producto */}
                                <div>
                                    <div className="flex items-center space-x-4">
                                        {/* Precio original (tachado solo si hay descuento) */}
                                        <h1 className={`text-3xl font-bold ${producto?.promocionesProductos.some(promocion => promocion.status) ? 'text-gray-500 line-through' : 'text-primary dark:text-secondary'}`}>
                                            S/ {producto?.precio}
                                        </h1>

                                        {/* Precio con descuento (solo si hay una promoción activa) */}
                                        {producto?.promocionesProductos
                                            .filter(promocion => promocion.status)
                                            .map(promocion => (
                                                <h1 key={promocion.id} className="text-3xl font-bold text-primary dark:text-secondary">
                                                    S/ {(parseFloat(producto.precio) * (1 - parseFloat(promocion.promociones.porcentaje_descuento) / 100)).toFixed(2)}
                                                </h1>
                                            ))}
                                    </div>
                                </div>


                                {/* Selección de color */}
                                <div>
                                    {/* Nombre y código de color seleccionado */}
                                    {colorSeleccionado && (
                                        <p className="text-xl font-bold">
                                            Selecciona tu color: {colorSeleccionado.nombre} - {colorSeleccionado.codigo_color}
                                        </p>
                                    )}

                                    {/* Miniaturas de imágenes de colores */}
                                    <div className="grid grid-cols-8 gap-2 mt-4">
                                        {producto?.imagenesColores.map(imagenColor => (
                                            <div key={imagenColor.id} className="flex flex-col items-center">
                                                <Image
                                                    src={imagenColor.imagen}
                                                    alt={`Color ${imagenColor.colores.nombre}`}
                                                    className={`w-16 h-16 object-cover rounded-full cursor-pointer ${imagenSeleccionada === imagenColor.imagen ? 'border-2 border-primary' : ''
                                                        }`}
                                                    width={64}
                                                    height={64}
                                                    onClick={() => handleSeleccionarImagen(imagenColor.imagen, imagenColor.colores)}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Etiquetas */}
                                <div>
                                    <p className='text-xs'>Etiqueta: {producto?.categoriasProductos.nombre}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductoDetalle;
