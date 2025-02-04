import React from 'react';
import Image from 'next/image';

interface ImageUploadProps {
    label: String;
    onImageUpload: (file: File) => void;
    imagePreview: string;
    setImagePreview: (preview: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ label, onImageUpload, imagePreview, setImagePreview }) => {
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;

        if (file) {
            onImageUpload(file);

            // Crear una URL de previsualización
            const previewURL = URL.createObjectURL(file);
            setImagePreview(previewURL);
        } else {
            setImagePreview('');
        }
    };

    return (
        <div className="space-y-2 text-dark dark:text-white">
            <strong>{label}:</strong>
            <input
                type="file"
                onChange={handleImageChange}
                accept="image/*"
                className="w-full"
            />

            {imagePreview && (
                <div className="flex justify-center">
                    <Image
                        src={imagePreview}
                        alt="Preview"
                        width={200}
                        height={200}
                        className="mt-2 max-w-full h-40 object-contain"
                        unoptimized
                    />
                </div>
            )}
        </div>
    );
};

export default ImageUpload;