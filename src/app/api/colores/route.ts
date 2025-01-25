import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        // Obtener los colores ordenados por ID descendente
        const colores = await prisma.colores.findMany({
            orderBy: { id: 'asc' },
        });

        return NextResponse.json(colores, { status: 200 });

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
        const { nombre, codigo_color } = body;

        if (!nombre || !codigo_color) {
            return NextResponse.json(
                { error: 'El nombre y el código del color son obligatorios.' },
                { status: 400 }
            );
        }

        const nuevoColor = await prisma.colores.create({
            data: { nombre, codigo_color },
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