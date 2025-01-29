"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Roboto } from "next/font/google";
import "../globals.css";
import Navbar from '@/components/layout/shop/navbar/page';
import Providers from '@/app/providers';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const roboto = Roboto({
    variable: "--font-roboto",
    subsets: ["latin"],
    weight: "400",
});

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    const pathname = usePathname();

    useEffect(() => {
        const formatTitle = (path: string) => {
            if (path === "/") return "Tejidos Yeka";

            // Divide la ruta en partes y usa la última
            const parts = path.split("/").filter(Boolean); // Filtra elementos vacíos
            const lastPart = parts[parts.length - 1];

            // Capitaliza la primera letra
            const formatted = lastPart.charAt(0).toUpperCase() + lastPart.slice(1);

            return `Tejidos Yeka - ${formatted}`;
        };

        document.title = formatTitle(pathname);
    }, [pathname]);

    return (
        <html lang="es">
            <body className={`${roboto.variable} antialiased bg-whitedark dark:bg-darklight`}>
                <Providers>
                    <Navbar />
                    <main className="p-6">
                        {children}
                    </main>
                    <ToastContainer position="top-right" autoClose={1000} toastClassName="toast-custom" />
                </Providers>
            </body>
        </html>
    );
}
