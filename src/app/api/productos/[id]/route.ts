import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma'; // Asegúrate de tener la configuración de Prisma en esta ubicación

// Endpoint GET para obtener un producto por ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params; // Obtén el ID del producto desde los parámetros de la URL

    try {
        const producto = await prisma.productos.findUnique({
            where: { id: parseInt(id) }, // Buscar el producto por su ID
            include: {
                categoriasProductos: true,
                materiales: true,
                marcas: true,
                imagenesColores: { // Incluir la relación de imagenesColores
                    include: {
                        colores: true, // Incluir detalles de los colores asociados
                    },
                },
                stockColores: { // Incluir la relación de stockColores
                    include: {
                        colores: true, // Incluir detalles de los colores asociados
                    },
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


// Endpoint POST para crear un nuevo producto
export async function POST(request: NextRequest) {
    const { nombre, descripcion, precio, id_categoria, id_color, id_material, id_marca, imagen_principal, stock } = await request.json();

    try {
        const nuevoProducto = await prisma.productos.create({
            data: {
                nombre,
                descripcion,
                precio: parseFloat(precio),
                id_categoria: id_categoria ? parseInt(id_categoria) : null,
                id_material: id_material ? parseInt(id_material) : null,
                id_marca: id_marca ? parseInt(id_marca) : null,
                imagen_principal,
                stock: stock ? parseInt(stock) : null,
            },
        });

        return NextResponse.json(nuevoProducto, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: 'Error al crear el producto' }, { status: 500 });
    }
}
