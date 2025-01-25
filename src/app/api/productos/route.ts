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
            where: filtros, // Aplicar los filtros
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
