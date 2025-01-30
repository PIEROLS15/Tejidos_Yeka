import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        // Obtener las marcas ordenados por ID descendente
        const marcas = await prisma.marcas.findMany({
            orderBy: { id: 'asc' },
        });

        return NextResponse.json(marcas, { status: 200 });

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

        const nuevoColor = await prisma.marcas.create({
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