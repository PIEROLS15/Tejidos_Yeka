import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        // Obtener el Stock de los colores ordenados por ID descendente
        const categorias = await prisma.categoriasProductos.findMany({
            orderBy: { id: 'asc' },
        });

        return NextResponse.json(categorias, { status: 200 });

    } catch {
        // Retornar un error con estado 500
        return NextResponse.json(
            { error: 'Ocurrió un error al obtener los colores.' },
            { status: 500 }
        );
    } finally {
        // Asegurarse de desconectar el cliente Prisma
        await prisma.$disconnect();
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { nombre } = body;

        if (!nombre) {
            return NextResponse.json(
                { error: 'El nombre es obligatorio' },
                { status: 400 }
            );
        }

        const nuevoColor = await prisma.categoriasProductos.create({
            data: { nombre },
        });

        return NextResponse.json(nuevoColor, { status: 201 });

    } catch (error) {
        return NextResponse.json(
            { error: 'Ocurrió un error al procesar la solicitud.' },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}

export async function DELETE(request: NextRequest) {
    try {
        // Obtener el ID de la categoría a eliminar desde los parámetros de la URL
        const url = new URL(request.url);
        const id = url.searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'El ID de la categoría es obligatorio' },
                { status: 400 }
            );
        }

        const categoriaId = parseInt(id, 10);

        // Verificar si la categoría existe
        const categoriaExistente = await prisma.categoriasProductos.findUnique({
            where: { id: categoriaId },
        });

        if (!categoriaExistente) {
            return NextResponse.json(
                { error: 'La categoría no existe' },
                { status: 404 }
            );
        }

        // Eliminar la categoría
        await prisma.categoriasProductos.delete({
            where: { id: categoriaId },
        });

        return NextResponse.json(
            { message: 'Categoría eliminada correctamente' },
            { status: 200 }
        );

    } catch (error) {
        return NextResponse.json(
            { error: 'Ocurrió un error al procesar la solicitud.' },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}