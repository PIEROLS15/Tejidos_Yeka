import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Obtener todos los usuarios o un usuario específico por ID
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (id) {
            // Obtener usuario específico
            const usuario = await prisma.usuarios.findUnique({
                where: { id: parseInt(id) }
            });

            if (!usuario) {
                return NextResponse.json(
                    { error: 'Usuario no encontrado' },
                    { status: 404 }
                );
            }

            return NextResponse.json(usuario, { status: 200 });
        }

        // Obtener todos los usuarios
        const usuarios = await prisma.usuarios.findMany();
        return NextResponse.json(usuarios, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Ocurrió un error al obtener los usuarios.' },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}

// Actualizar un usuario existente
export async function PUT(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'Se requiere un ID de usuario' },
                { status: 400 }
            );
        }

        const datos = await request.json();

        // Verificar si el usuario existe
        const usuarioExistente = await prisma.usuarios.findUnique({
            where: { id: parseInt(id) }
        });

        if (!usuarioExistente) {
            return NextResponse.json(
                { error: 'Usuario no encontrado' },
                { status: 404 }
            );
        }

        // Actualizar usuario
        const usuarioActualizado = await prisma.usuarios.update({
            where: { id: parseInt(id) },
            data: datos
        });

        return NextResponse.json(usuarioActualizado, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Ocurrió un error al actualizar el usuario.' },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
