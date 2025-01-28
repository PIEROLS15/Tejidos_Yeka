import { NextRequest } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
    try {
        const data = await request.formData();
        const file = data.get('file');

        if (!file || !(file instanceof File)) {
            return new Response(
                JSON.stringify({ error: 'No file uploaded' }),
                { status: 400 }
            );
        }

        // Genera un nombre unico
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        const originalName = file.name;
        const extension = path.extname(originalName);
        const fileName = `${path.basename(originalName, extension)}-${uniqueSuffix}${extension}`;

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Cree la ruta completa y guarde el archivo
        const filePath = path.join(process.cwd(), 'public', 'images', fileName);
        await writeFile(filePath, buffer);

        return new Response(
            JSON.stringify({
                message: 'File uploaded successfully',
                fileName: fileName
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error('Error uploading file:', error);
        return new Response(
            JSON.stringify({ error: 'Error uploading file' }),
            { status: 500 }
        );
    }
}