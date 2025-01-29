import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const id_producto = parseInt(params.id, 10);
        if (isNaN(id_producto)) {
            return NextResponse.json(
                { error: 'El ID del producto debe ser un número válido.' },
                { status: 400 }
            );
        }

        const imagenesColores = await prisma.imagenesColores.findMany({
            where: { id_producto },
            include: {
                colores: {
                    include: {
                        stockColores: {},
                    }
                }
            }
        });

        if (imagenesColores.length === 0) {
            return NextResponse.json(
                { error: `No se encontraron imágenes para el producto con ID ${id_producto}.` },
                { status: 404 }
            );
        }

        return NextResponse.json(imagenesColores, { status: 200 });

    } catch (error: any) {
        console.error('Error en el GET por ID:', error);
        return NextResponse.json(
            { error: `Error en el servidor: ${error.message}` },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}


export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { searchParams } = new URL(req.url);
        const id_producto = parseInt(searchParams.get('id_producto') || '', 10);
        const id_color = parseInt(params.id, 10);

        if (isNaN(id_color) || isNaN(id_producto)) {
            return NextResponse.json(
                { error: 'El ID del color y el ID del producto deben ser números válidos.' },
                { status: 400 }
            );
        }

        // Verificar si existen registros en imagenesColores con el id_producto e id_color
        const imagenesColoresExistentes = await prisma.imagenesColores.findMany({
            where: { id_producto, id_color }
        });

        if (imagenesColoresExistentes.length === 0) {
            return NextResponse.json(
                { error: `No se encontraron imágenes con el color ID ${id_color} para el producto ID ${id_producto}.` },
                { status: 404 }
            );
        }

        // Eliminar los registros de stockColores relacionados
        await prisma.stockColores.deleteMany({
            where: { id_producto, id_color }
        });

        // Eliminar los registros de imagenesColores relacionados
        await prisma.imagenesColores.deleteMany({
            where: { id_producto, id_color }
        });

        return NextResponse.json(
            { message: `Se eliminaron correctamente las imágenes y stock del color ID ${id_color} para el producto ID ${id_producto}.` },
            { status: 200 }
        );

    } catch (error: any) {
        console.error('Error en el DELETE:', error);
        return NextResponse.json(
            { error: `Error en el servidor: ${error.message}` },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}