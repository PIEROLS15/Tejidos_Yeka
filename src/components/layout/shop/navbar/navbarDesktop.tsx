"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { signOut } from "next-auth/react";
import {
    FaUser,
    FaSignInAlt,
    FaUserPlus,
    FaUserCircle,
    FaCogs,
    FaSignOutAlt,
    FaSearch,
    FaShoppingCart,
    FaTimes,
    FaTrash
} from "react-icons/fa";
import ThemeToggle from '@/components/ui/themeToggle'
import { Session } from 'next-auth';

interface DesktopNavbarProps {
    session: Session | null;
    isDropdownOpen: boolean;
    toggleDropdown: () => void;
    openLoginModal: () => void;
    openRegisterModal: () => void;
}

const DesktopNavbar = ({
    session,
    isDropdownOpen,
    toggleDropdown,
    openLoginModal,
    openRegisterModal
}: DesktopNavbarProps) => {
    const [isCartOpen, setIsCartOpen] = useState(false);

    const toggleCart = () => {
        setIsCartOpen(!isCartOpen);
    };

    return (
        <>
            <div className="hidden lg:flex justify-between items-center px-8">
                {/* Lado izquierdo */}
                <div className="flex items-center space-x-[10px] xl:space-x-[20px] 2xl:space-x-[38px]">
                    <div className="mr-1">
                        <a href="/">
                            <Image
                                src="/icons/logo.png"
                                alt="Logo"
                                width={100}
                                height={80}
                            />
                        </a>
                    </div>
                    <div>
                        <ul className="flex space-x-[15px] xl:space-x-[25px] text-[11px] xl:text-[12px] 2xl:text-[14px] font-semibold">
                            <li><a href="/" className="text-white hover:text-secondary">INICIO</a></li>
                            <li><a href="/tienda/productos" className="text-white hover:text-secondary">PRODUCTOS</a></li>
                            <li><a href="/tienda/amigurumi" className="text-white hover:text-secondary">COTIZA TU AMIGURUMI</a></li>
                            <li><a href="/tienda/sobremi" className="text-white hover:text-secondary">SOBRE MI</a></li>
                        </ul>
                    </div>
                </div>

                {/* Lado derecho */}
                <div className="flex items-center space-x-[28px]">
                    {/* Barra de búsqueda */}
                    <div className="flex items-center space-x-2">
                        <div className="relative">
                            <input
                                type="text"
                                className="border rounded-[20px] py-2 pl-3 pr-10 text-sm w-[200px] xl:w-[280px] 2xl:w-[380px] text-dark outline-none"
                                placeholder="¿Qué estás buscando?"
                            />
                            <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-darklight" />
                        </div>
                    </div>

                    {/* Usuario */}
                    <div className="relative flex items-center space-x-2" onClick={toggleDropdown}>
                        <FaUser className="text-2xl cursor-pointer" />
                        <span className="text-[11px] xl:text-[12px] 2xl:text-[14px] text-white cursor-pointer font-semibold">
                            {session?.user ? `¡Hola, ${session.user.name}!` : 'Iniciar sesión'}
                        </span>
                        {isDropdownOpen && (
                            <div className="absolute top-full right-0 mt-2 bg-white text-black rounded shadow-lg py-2 w-48 z-50 dark:bg-darklight">
                                {session?.user ? (
                                    <>
                                        <a href="/tienda/profile" className="flex items-center px-4 py-2 hover:bg-gray-200 text-primary dark:text-white">
                                            <FaUserCircle className="mr-2" /> Mi Perfil
                                        </a>
                                        <a href="/admin" className="flex items-center px-4 py-2 hover:bg-gray-200 text-primary dark:text-white">
                                            <FaCogs className="mr-2" /> Admin
                                        </a>
                                        <button onClick={() => signOut({ callbackUrl: "/" })} className="flex items-center w-full px-4 py-2 hover:bg-gray-200 text-primary dark:text-white">
                                            <FaSignOutAlt className="mr-2" /> Log Out
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={openLoginModal} className="flex items-center w-full px-4 py-2 hover:bg-gray-200 text-primary dark:text-white">
                                            <FaSignInAlt className="mr-2" /> Iniciar Sesión
                                        </button>
                                        <button onClick={openRegisterModal} className="flex items-center w-full px-4 py-2 hover:bg-gray-200 text-primary dark:text-white">
                                            <FaUserPlus className="mr-2" /> Registrarse
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Carrito */}
                    <div className="relative cursor-pointer" onClick={toggleCart}>
                        <FaShoppingCart className="text-2xl" />
                        <span className="absolute -top-2 -right-2 bg-secondary text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                            2
                        </span>
                    </div>

                    {/* Toggle tema */}
                    <ThemeToggle />
                </div>
            </div>

            {/* Overlay oscuro cuando el carrito está abierto */}
            {isCartOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={toggleCart}
                />
            )}

            {/* Sidebar Carrito */}
            <div className={`fixed top-0 right-0 h-full w-[500px] bg-white dark:bg-darklight transform transition-transform duration-300 ease-in-out z-50 ${isCartOpen ? 'translate-x-0' : 'translate-x-full'
                }`}>
                <div className="flex flex-col h-full">
                    <div className="p-6 border-b dark:border-gray-700">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold">Carrito de Compras</h2>
                            <button onClick={toggleCart} className="hover:text-gray-600 transition-colors">
                                <Image
                                    src="/icons/close.svg"
                                    alt="Cerrar"
                                    width={24}
                                    height={24}
                                />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="space-y-6">
                            <div className="flex items-center space-x-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden">
                                    <Image
                                        src="/icons/logo.png"
                                        alt="Producto"
                                        width={80}
                                        height={80}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-medium text-lg">Amigurumi Gato</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Cantidad: 1</p>
                                    <p className="text-primary font-medium text-lg mt-1">$25.00</p>
                                </div>
                                <button className="text-red-500 hover:text-red-600 p-2">
                                    <FaTrash size={18} />
                                </button>
                            </div>

                            <div className="flex items-center space-x-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden">
                                    <Image
                                        src="/icons/logo.png"
                                        alt="Producto"
                                        width={80}
                                        height={80}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-medium text-lg">Amigurumi Perro</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Cantidad: 1</p>
                                    <p className="text-primary font-medium text-lg mt-1">$30.00</p>
                                </div>
                                <button className="text-red-500 hover:text-red-600 p-2">
                                    <FaTrash size={18} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 border-t dark:border-gray-700">
                        <div className="mb-6 space-y-3">
                            <div className="flex justify-between text-lg">
                                <span>Subtotal</span>
                                <span>$55.00</span>
                            </div>
                            <div className="flex justify-between text-lg font-semibold">
                                <span>Total</span>
                                <span>$55.00</span>
                            </div>
                        </div>
                        <button className="w-full bg-primary text-white py-4 rounded-lg hover:bg-opacity-90 transition-colors text-lg font-medium">
                            Proceder al pago
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DesktopNavbar;