import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const marcas = await prisma.marcas.findMany({
            orderBy: { id: 'asc' },
        });

        return NextResponse.json(marcas, { status: 200 });

    } catch {
        return NextResponse.json(
            { error: 'Ocurrió un error al obtener los colores.' },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { nombre, logo } = body;

        if (!nombre && !logo) {
            return NextResponse.json(
                { error: 'Todos los campos son obligatorios' },
                { status: 400 }
            );
        }

        const nuevaMarca = await prisma.marcas.create({
            data: { nombre, logo },
        });

        return NextResponse.json(nuevaMarca, { status: 201 });

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
        const url = new URL(request.url);
        const id = url.searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'El ID de la marca es obligatorio' },
                { status: 400 }
            );
        }

        const marcaId = parseInt(id, 10);

        const categoriaExistente = await prisma.marcas.findUnique({
            where: { id: marcaId },
        });

        if (!categoriaExistente) {
            return NextResponse.json(
                { error: 'La marca no existe' },
                { status: 404 }
            );
        }

        await prisma.marcas.delete({
            where: { id: marcaId },
        });

        return NextResponse.json(
            { message: 'Marca eliminada correctamente' },
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