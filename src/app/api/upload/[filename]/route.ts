import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function DELETE(
    request: NextRequest,
    { params }: { params: { filename: string } }
) {
    try {
        const filename = params.filename;

        // Validar que el nombre del archivo sea válido
        if (!filename) {
            return NextResponse.json(
                { error: 'Nombre de archivo no proporcionado' },
                { status: 400 }
            );
        }

        // Asegúrate de que esta ruta coincida con donde guardas las imágenes
        const filePath = path.join(process.cwd(), 'public', 'images', filename);

        // Verificar si el archivo existe
        if (!fs.existsSync(filePath)) {
            return NextResponse.json(
                { error: 'El archivo no existe' },
                { status: 404 }
            );
        }

        // Eliminar el archivo
        fs.unlinkSync(filePath);

        return NextResponse.json(
            { message: 'Archivo eliminado correctamente' },
            { status: 200 }
        );

    } catch (error: any) {
        console.error('Error al eliminar el archivo:', error);
        return NextResponse.json(
            { error: 'Error al eliminar el archivo' },
            { status: 500 }
        );
    }
}