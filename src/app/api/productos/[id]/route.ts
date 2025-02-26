import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;

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
        stock,
        stockColores,
        imagenesColores
    } = await request.json();

    try {
        // Actualizar el producto principal
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

        // Actualizar stockColores
        if (stockColores && stockColores.length > 0) {
            for (const stockColor of stockColores) {
                await prisma.stockColores.updateMany({
                    where: {
                        id_producto: parseInt(id),
                        id_color: stockColor.id_color,
                    },
                    data: {
                        cantidad: stockColor.cantidad,
                    },
                });
            }
        }

        // Actualizar imagenesColores
        if (imagenesColores && imagenesColores.length > 0) {
            for (const imagenColor of imagenesColores) {
                await prisma.imagenesColores.updateMany({
                    where: {
                        id_producto: parseInt(id),
                        id_color: imagenColor.id_color,
                    },
                    data: {
                        imagen: imagenColor.imagen,
                    },
                });
            }
        }

        // Obtener el producto actualizado con todas las relaciones
        const productoCompleto = await prisma.productos.findUnique({
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
            },
        });

        return NextResponse.json(productoCompleto, { status: 200 });
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        return NextResponse.json({
            message: 'Error al actualizar el producto',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}


export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;

    try {
        // Eliminar las relaciones de promociones asociadas al producto
        await prisma.promocionesProductos.deleteMany({
            where: { id_producto: parseInt(id) },
        });

        // Eliminar las relaciones de imágenes asociadas al producto
        await prisma.imagenesColores.deleteMany({
            where: { id_producto: parseInt(id) },
        });

        // Eliminar las relaciones de stock asociadas al producto
        await prisma.stockColores.deleteMany({
            where: { id_producto: parseInt(id) },
        });

        // Eliminar las relaciones de colores asociadas al producto
        await prisma.colores.deleteMany({
            where: { productos: { some: { id: parseInt(id) } } },
        });

        // Finalmente, eliminar el producto
        const productoEliminado = await prisma.productos.delete({
            where: { id: parseInt(id) },
        });

        if (!productoEliminado) {
            return NextResponse.json({ message: 'Producto no encontrado' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Producto eliminado con éxito' }, { status: 200 });
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        return NextResponse.json({ message: 'Error al eliminar el producto' }, { status: 500 });
    }
}
