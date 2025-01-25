'use client';

import Navbar from "@/components/layout/shop/navbar/page";
import { SessionProvider } from 'next-auth/react';
import Image from 'next/image';
import "./globals.css";

const NotFound = () => {
    return (
        <>
            <SessionProvider>
                <div className="flex flex-col h-screen">
                    <Navbar />
                    <main className="flex flex-col items-center justify-center dark:bg-dark dark:text-white w-full flex-grow overflow-x-hidden">
                        <div className="text-6xl flex items-center justify-center">
                            4
                            <Image
                                src="/icons/404.svg"
                                alt="Icono de lana"
                                width={100}
                                height={100}
                            />
                            4
                        </div>
                        <p className="mt-4 text-xl">Página no encontrada</p>
                    </main>
                </div>
            </SessionProvider>
        </>
    );
}

export default NotFound;
