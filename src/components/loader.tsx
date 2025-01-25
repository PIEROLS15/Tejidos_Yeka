import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface LoaderProps {
    duration: number;
}

const Loader: React.FC<LoaderProps> = ({ duration }) => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Temporizador para ocultar el loader después de la duración indicada
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration]);

    return (
        isLoading && (
            <div className="fixed inset-0 bg-white dark:bg-dark bg-opacity-100 flex justify-center items-center z-50">
                <Image
                    src="/icons/loader.svg"
                    alt="Cargando..."
                    width={100}
                    height={100}
                    className="dark:hidden"
                />
                <Image
                    src="/icons/loaderDark.svg"
                    alt="Cargando..."
                    width={100}
                    height={100}
                    className="hidden dark:block"
                />
            </div>
        )
    );
};

export default Loader;
