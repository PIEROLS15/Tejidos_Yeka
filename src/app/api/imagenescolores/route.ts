import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const marcas = await prisma.imagenesColores.findMany({
            orderBy: { id: 'asc' },
            include: {
                colores: {
                    include: {
                        stockColores: {}
                    }
                },
            }
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

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { id_producto, imagen, id_color, cantidad } = body;

        // Validar campos requeridos
        if (!id_producto || !imagen || !id_color || cantidad === undefined) {
            return NextResponse.json(
                { error: 'Todos los campos (id_producto, imagen, id_color, cantidad) son obligatorios.' },
                { status: 400 }
            );
        }

        // Verificar si el color existe
        const colorExiste = await prisma.colores.findUnique({
            where: { id: id_color }
        });

        if (!colorExiste) {
            return NextResponse.json(
                { error: `El color con id ${id_color} no existe.` },
                { status: 404 }
            );
        }

        // Verificar si ya existe una imagen con ese color para ese producto
        const imagenExistente = await prisma.imagenesColores.findFirst({
            where: {
                AND: [
                    { id_producto: id_producto },
                    { id_color: id_color }
                ]
            }
        });

        if (imagenExistente) {
            return NextResponse.json(
                { error: 'Ya existe una imagen con este color para este producto.' },
                { status: 409 }
            );
        }

        // Crear la imagen con el color
        const nuevaImagen = await prisma.imagenesColores.create({
            data: {
                id_producto,
                imagen,
                id_color
            }
        });

        // Agregar stock asociado al color
        const nuevoStock = await prisma.stockColores.create({
            data: {
                id_producto,
                id_color,
                cantidad
            }
        });

        return NextResponse.json(
            { message: 'Imagen y stock agregados correctamente', nuevaImagen, nuevoStock },
            { status: 201 }
        );

    } catch (error: any) {
        console.error('Error en el POST:', error);
        return NextResponse.json(
            { error: `Error en el servidor: ${error.message}` },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}