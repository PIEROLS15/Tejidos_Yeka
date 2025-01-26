'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

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

const Productos = () => {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    // Función para obtener los productos desde la API
    const fetchProductos = async () => {
        try {
            const response = await fetch('/api/productos');
            if (!response.ok) {
                throw new Error('Error al obtener los productos');
            }
            const data: Producto[] = await response.json();

            const productosConImagen = data.filter(
                (producto) => producto.imagen_principal || producto.imagenesColores.length > 0
            );

            setProductos(productosConImagen);
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

    useEffect(() => {
        fetchProductos();
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-semibold mb-6">Productos</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {productos.map((producto) => {
                    // Buscamos la primera promoción activa para el producto
                    const promocion = producto.promocionesProductos.find(
                        (promo) => promo.status === true
                    )?.promociones;

                    // Convertir el porcentaje de descuento de string a número
                    const porcentajeDescuento = promocion ? parseFloat(promocion.porcentaje_descuento) : 0;

                    // Calcular el precio con descuento
                    const precio = parseFloat(producto.precio);
                    const precioConDescuento = precio - (precio * porcentajeDescuento) / 100;

                    // Seleccionamos la imagen de colores si no hay imagen principal
                    const imagenProducto = producto.imagen_principal || producto.imagenesColores[0]?.imagen;

                    return (
                        <div key={producto.id} className="bg-white rounded-lg shadow-lg overflow-hidden dark:bg-dark">
                            {imagenProducto ? (
                                <div className="relative">
                                    <Image
                                        src={imagenProducto}
                                        alt={producto.nombre}
                                        className="w-full h-80 object-cover"
                                        width={400}
                                        height={80}
                                    />
                                    {promocion && (
                                        <div className="absolute top-2 right-2 bg-primary text-white p-2 rounded-md">
                                            Descuento {promocion.porcentaje_descuento}%
                                        </div>
                                    )}
                                </div>
                            ) : null}

                            <div className="p-4 items-center justify-center text-center space-y-5">
                                <div className="space-y-[10px]">
                                    <h2 className="text-xl font-semibold text-dark dark:text-white">{producto.nombre}</h2>
                                    <div className="flex justify-center items-center space-x-4">
                                        {promocion ? (
                                            <>
                                                <p className="text-lg font-bold text-gray-500 line-through">
                                                    S/ {producto.precio}
                                                </p>
                                                <p className="text-lg font-bold text-primary dark:text-secondary">
                                                    S/ {precioConDescuento.toFixed(2)}
                                                </p>
                                            </>
                                        ) : (
                                            <p className="text-lg font-bold text-primary dark:text-secondary">
                                                S/ {producto.precio}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Botón para ver detalles */}
                                <button
                                    className="mt-4 font-bold bg-white text-primary border border-primary rounded-[20px] px-4 py-2 hover:bg-primary hover:text-white transition"
                                    onClick={() => router.push(`/tienda/productos/${producto.id}`)}
                                >
                                    Ver Detalles
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Productos;
