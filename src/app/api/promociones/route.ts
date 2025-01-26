import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        // Obtener las promociones ordenados por ID descendente
        const promociones = await prisma.promocionesProductos.findMany({
            orderBy: { id: 'asc' },
            include: {
                productos: {},
                promociones: {
                }
            }
        });
        return NextResponse.json(promociones, { status: 200 });

    } catch {
        // Retornar un error con estado 500
        return NextResponse.json(
            { error: 'Ocurrió un error al obtener los roles.' },
            { status: 500 }
        );
    } finally {
        // Asegurarse de desconectar el cliente Prisma
        await prisma.$disconnect();
    }
}

export async function POST(request: Request) {
    try {
        // Obtener los datos del body de la solicitud
        const { nombre, porcentaje_descuento, fecha_inicio, fecha_fin, id_producto } = await request.json();

        // Validar si los datos necesarios están presentes
        if (!nombre || !porcentaje_descuento || !fecha_inicio || !fecha_fin || !id_producto) {
            return NextResponse.json(
                { error: 'Faltan datos requeridos: nombre, porcentaje_descuento, fecha_inicio, fecha_fin, id_producto.' },
                { status: 400 }
            );
        }

        // Crear la nueva promoción en la base de datos
        const nuevaPromocion = await prisma.promociones.create({
            data: {
                nombre,
                porcentaje_descuento,
                fecha_inicio: new Date(fecha_inicio),
                fecha_fin: new Date(fecha_fin),
                promocionesProductos: {
                    create: {
                        id_producto,
                    },
                },
            },
        });

        // Retornar la promoción creada con su relación
        return NextResponse.json(nuevaPromocion, { status: 201 });

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: 'Ocurrió un error al crear la promoción.' },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}


export async function PUT(request: Request) {
    try {
        const { id, nombre, porcentaje_descuento, fecha_inicio, fecha_fin, status, id_producto } = await request.json();

        // Validar que los datos necesarios estén presentes
        if (!id || !nombre || !porcentaje_descuento || !fecha_inicio || !fecha_fin || id_producto === undefined) {
            return NextResponse.json(
                { error: 'Faltan datos requeridos.' },
                { status: 400 }
            );
        }

        // Primero actualizamos la promoción
        const promocionActualizada = await prisma.promociones.update({
            where: { id },
            data: {
                nombre,
                porcentaje_descuento,
                fecha_inicio: new Date(fecha_inicio),
                fecha_fin: new Date(fecha_fin),
            },
        });

        // Luego actualizamos la relación con el producto
        await prisma.promocionesProductos.updateMany({
            where: {
                id_promocion: id,
            },
            data: {
                id_producto,
                status,
            },
        });

        // Obtener la promoción actualizada con sus relaciones
        const promocionCompleta = await prisma.promociones.findUnique({
            where: { id },
            include: {
                promocionesProductos: {
                    include: {
                        productos: true,
                    },
                },
            },
        });

        return NextResponse.json(promocionCompleta, { status: 200 });

    } catch (error) {
        console.error('Error en PUT:', error);
        return NextResponse.json(
            { error: 'Ocurrió un error al actualizar la promoción.' },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}