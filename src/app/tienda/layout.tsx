import type { Metadata } from "next";
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

export const metadata: Metadata = {
    title: "Tejidos Yeka",
    description: "Las mejores lanas en el sur",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
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
