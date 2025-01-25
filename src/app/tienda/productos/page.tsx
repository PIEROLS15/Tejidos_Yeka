'use client'
import { useState, useEffect } from 'react';
import Image from 'next/image';

type Producto = {
    id: number;
    nombre: string;
    descripcion: string;
    imagen_principal: string;
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
};

const Productos = () => {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Función para obtener los productos desde la API
    const fetchProductos = async () => {
        try {
            const response = await fetch('/api/productos');
            if (!response.ok) {
                throw new Error('Error al obtener los productos');
            }
            const data: Producto[] = await response.json();

            // Filtrar productos que tengan al menos una imagen en imagen_principal o en imagenesColores
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

    if (loading) {
        return <div className="text-center text-xl">Cargando...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500">{error}</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-semibold mb-6">Productos</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {productos.map((producto) => (
                    <div key={producto.id} className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                        {/* Imagen del producto */}
                        {producto.imagen_principal ? (
                            <Image
                                src={producto.imagen_principal}
                                alt={producto.nombre}
                                className="w-full h-48 object-cover"
                                width={400}
                                height={192}
                            />
                        ) : producto.imagenesColores.length > 0 ? (
                            <Image
                                src={producto.imagenesColores[0].imagen}
                                alt={producto.nombre}
                                className="w-full h-48 object-cover"
                                width={400}
                                height={192}
                            />
                        ) : null}

                        <div className="p-4">
                            <h2 className="text-xl font-semibold">{producto.nombre}</h2>
                            <p className="text-sm text-gray-600 mt-2">{producto.descripcion}</p>
                            <p className="text-lg font-bold mt-4">${producto.precio}</p>

                            <div className="mt-2">
                                <h3 className="text-sm text-gray-800">Categoría</h3>
                                <p className="text-sm text-gray-600">{producto.categoriasProductos.nombre}</p>
                            </div>

                            <div className="mt-2">
                                <h3 className="text-sm text-gray-800">Material</h3>
                                <p className="text-sm text-gray-600">{producto.materiales.nombre}</p>
                            </div>

                            <div className="mt-2">
                                <h3 className="text-sm text-gray-800">Marca</h3>
                                <p className="text-sm text-gray-600">{producto.marcas.nombre}</p>
                                {producto.marcas.logo && (
                                    <Image
                                        src={producto.marcas.logo}
                                        alt="Logo de la marca"
                                        className="mt-2 h-6"
                                    />
                                )}
                            </div>

                            <div className="mt-4">
                                <h3 className="text-sm text-gray-800">Imágenes y Colores</h3>
                                <div>
                                    {producto.imagenesColores.map((imagenColor) => (
                                        <div key={imagenColor.id} className="flex items-center mt-2">
                                            <Image
                                                src={imagenColor.imagen}
                                                alt={`Color ${imagenColor.colores.nombre}`}
                                                className="w-12 h-12 object-cover rounded-full mr-2"
                                                width={48}
                                                height={48}
                                            />
                                            <div>
                                                <p className="text-sm text-gray-600">Color: {imagenColor.colores.nombre}</p>
                                                <p className="text-sm text-gray-500">Código: {imagenColor.colores.codigo_color}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-4">
                                <h3 className="text-sm text-gray-800">Stock por Color</h3>
                                {producto.stockColores.map((stockColor) => (
                                    <div key={stockColor.id} className="flex justify-between mt-2">
                                        <p className="text-sm text-gray-600">Cantidad: {stockColor.cantidad}</p>
                                        <p className="text-sm text-gray-600">
                                            {stockColor.colores.nombre} - {stockColor.colores.codigo_color}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Productos;

