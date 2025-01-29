import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/prisma'; // Asegúrate de tener la configuración de Prisma en esta ubicación

// Endpoint GET para obtener productos con filtro
export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const categoriaId = url.searchParams.get('categoriaId'); // Obtener el parámetro 'categoriaId' de la URL
    const precioMax = url.searchParams.get('precioMax'); // Obtener el parámetro 'precioMax' de la URL

    try {
        const filtros: any = {}; // Objeto para los filtros dinámicos

        if (categoriaId) {
            filtros.id_categoria = parseInt(categoriaId); // Filtrar por categoría
        }

        if (precioMax) {
            filtros.precio = {
                lte: parseFloat(precioMax), // Filtrar por precio máximo
            };
        }

        const productos = await prisma.productos.findMany({
            where: filtros,
            include: {
                categoriasProductos: true,
                materiales: true,
                marcas: true,
                imagenesColores: {
                    include: {
                        colores: true,
                    },
                },
                stockColores: {
                    include: {
                        colores: true,
                    },
                },
                promocionesProductos: {
                    include: {
                        promociones: {}
                    }
                },
            },
        });

        if (productos.length === 0) {
            return NextResponse.json({ message: 'No se encontraron productos' }, { status: 404 });
        }

        return NextResponse.json(productos, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error al obtener los productos' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const {
            nombre,
            precio,
            stock = null,
            id_categoria,
            id_materiales = null,
            id_marcas = null,
            descripcion,
            imagen_principal = null
        } = body;

        // Validaciones básicas
        if (!nombre || !precio || !id_categoria || !descripcion) {
            return NextResponse.json({ message: "Todos los campos obligatorios deben estar presentes" }, { status: 400 });
        }

        // Validación de precio (asegurarse que sea un número válido)
        if (isNaN(precio) || parseFloat(precio) <= 0) {
            return NextResponse.json({ message: "El precio debe ser un número válido mayor que cero" }, { status: 400 });
        }

        // Creación del producto
        const nuevoProducto = await prisma.productos.create({
            data: {
                nombre,
                precio: parseFloat(precio),
                stock: stock !== null ? parseInt(stock) : null,
                id_categoria: parseInt(id_categoria),
                id_material: id_materiales ? parseInt(id_materiales) : null,
                id_marca: id_marcas ? parseInt(id_marcas) : null,
                descripcion,
                imagen_principal: imagen_principal || null
            }
        });

        return NextResponse.json(nuevoProducto, { status: 201 });
    } catch (error) {
        console.error("Error al crear el producto:", error);
        return NextResponse.json({ message: "Error al crear el producto" }, { status: 500 });
    }
}