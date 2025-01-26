import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma'; // Asegúrate de tener la configuración de Prisma en esta ubicación
import { Promociones } from '@prisma/client';

// Endpoint GET para obtener un producto por ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params; // Obtén el ID del producto desde los parámetros de la URL

    try {
        const producto = await prisma.productos.findUnique({
            where: { id: parseInt(id) },
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

        if (!producto) {
            return NextResponse.json({ message: 'Producto no encontrado' }, { status: 404 });
        }

        return NextResponse.json(producto, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error al obtener el producto' }, { status: 500 });
    }
}

// Endpoint PUT para actualizar un producto existente
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;
    const {
        nombre,
        descripcion,
        precio,
        id_categoria,
        id_material,
        id_marca,
        imagen_principal,
        stock
    } = await request.json();

    try {
        const productoActualizado = await prisma.productos.update({
            where: { id: parseInt(id) },
            data: {
                nombre,
                descripcion,
                precio: precio ? parseFloat(precio) : undefined,
                id_categoria: id_categoria ? parseInt(id_categoria) : undefined,
                id_material: id_material ? parseInt(id_material) : undefined,
                id_marca: id_marca ? parseInt(id_marca) : undefined,
                imagen_principal,
                stock: stock ? parseInt(stock) : undefined,
            },
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

        return NextResponse.json(productoActualizado, { status: 200 });
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        return NextResponse.json({
            message: 'Error al actualizar el producto',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}