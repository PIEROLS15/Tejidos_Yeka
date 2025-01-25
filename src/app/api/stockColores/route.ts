import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        // Obtener el Stock de los colores ordenados por ID descendente
        const Stockcolores = await prisma.stockColores.findMany({
            orderBy: { id: 'asc' },
        });

        return NextResponse.json(Stockcolores, { status: 200 });

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