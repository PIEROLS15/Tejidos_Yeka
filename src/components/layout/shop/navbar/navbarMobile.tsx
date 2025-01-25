"use client";

import React from 'react';
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
    FaBars,
    FaTimes,
    FaTrash
} from "react-icons/fa";
import ThemeToggle from '@/components/ui/themeToggle'
import { Session } from 'next-auth';

interface MobileNavbarProps {
    session: Session | null;
    isDropdownOpen: boolean;
    isMobileMenuOpen: boolean;
    toggleDropdown: () => void;
    toggleMobileMenu: () => void;
    openLoginModal: () => void;
    openRegisterModal: () => void;
}

const MobileNavbar = ({
    session,
    isDropdownOpen,
    isMobileMenuOpen,
    toggleDropdown,
    toggleMobileMenu,
    openLoginModal,
    openRegisterModal
}: MobileNavbarProps) => {
    const [isCartOpen, setIsCartOpen] = React.useState(false);

    const toggleCart = () => {
        setIsCartOpen(!isCartOpen);
    };

    return (
        <div className="lg:hidden">
            {/* Barra superior con iconos */}
            <div className="flex justify-between items-center px-3 py-3">
                <a href="/" className="flex-shrink-0">
                    <Image
                        src="/icons/logo.png"
                        alt="Logo"
                        width={80}
                        height={100}
                    />
                </a>

                <div className="flex items-center space-x-[20px] sm:space-x-[40px] md:space-x-[50px]">
                    <button onClick={toggleDropdown} className="relative flex items-center space-x-2">
                        <FaUser className="text-xl" />
                        <span className="text-[11px] sm:text-[12px] md:text-[14px] text-white cursor-pointer font-semibold xs:inline-block hidden">
                            {session?.user ? `¡Hola, ${session.user.name}!` : 'Iniciar sesión'}
                        </span>
                    </button>

                    <button onClick={toggleCart} className="relative">
                        <FaShoppingCart className="text-xl" />
                        <span className="absolute -top-2 -right-2 bg-secondary text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                            2
                        </span>
                    </button>

                    <ThemeToggle />

                    <button onClick={toggleMobileMenu} className="text-[25px]">
                        <FaBars />
                    </button>
                </div>
            </div>

            {/* Barra de búsqueda */}
            <div className="px-4 pb-5">
                <div className="relative">
                    <input
                        type="text"
                        className="w-full border rounded-[20px] py-2 pl-3 pr-10 text-sm text-dark outline-none"
                        placeholder="¿Qué estás buscando?"
                    />
                    <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-darklight" />
                </div>
            </div>

            {/* Overlay oscuro cuando cualquier sidebar está abierto */}
            {(isDropdownOpen || isCartOpen) && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={() => {
                        if (isDropdownOpen) toggleDropdown();
                        if (isCartOpen) toggleCart();
                    }}
                />
            )}

            {/* Sidebar Usuario */}
            <div className={`fixed top-0 left-0 h-full w-[50%] bg-white dark:bg-dark transform transition-transform duration-300 ease-in-out z-50 ${isDropdownOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                <div className="p-4">
                    <button onClick={toggleDropdown} className="absolute top-4 right-4">
                        <Image
                            src="/icons/close.svg"
                            alt="Cerrar"
                            width={24}
                            height={24}
                        />
                    </button>

                    <div className="mt-8">
                        {session?.user ? (
                            <div className="space-y-4">
                                <a href="/tienda/profile" className="flex items-center px-4 py-2 hover:bg-gray-200 text-primary dark:text-white rounded-lg">
                                    <FaUserCircle className="mr-2" /> Mi Perfil
                                </a>
                                <a href="/admin" className="flex items-center px-4 py-2 hover:bg-gray-200 text-primary dark:text-white rounded-lg">
                                    <FaCogs className="mr-2" /> Admin
                                </a>
                                <button
                                    onClick={() => signOut({ callbackUrl: "/" })}
                                    className="flex items-center w-full px-4 py-2 hover:bg-gray-200 text-primary dark:text-white rounded-lg"
                                >
                                    <FaSignOutAlt className="mr-2" /> Log Out
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <button
                                    onClick={openLoginModal}
                                    className="flex items-center w-full px-4 py-2 hover:bg-gray-200 text-primary dark:text-white rounded-lg"
                                >
                                    <FaSignInAlt className="mr-2" /> Iniciar Sesión
                                </button>
                                <button
                                    onClick={openRegisterModal}
                                    className="flex items-center w-full px-4 py-2 hover:bg-gray-200 text-primary dark:text-white rounded-lg"
                                >
                                    <FaUserPlus className="mr-2" /> Registrarse
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Sidebar Carrito */}
            <div className={`fixed top-0 right-0 h-full w-[70%] bg-whitedark dark:bg-darklight transform transition-transform duration-300 ease-in-out z-50 ${isCartOpen ? 'translate-x-0' : 'translate-x-full'
                }`}>
                <div className="flex flex-col h-full">
                    <div className="p-4 border-b dark:border-gray-700">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-dark dark:text-white">Carrito de Compras</h2>
                            <button onClick={toggleCart}>
                                <Image
                                    src="/icons/close.svg"
                                    alt="Cerrar"
                                    width={24}
                                    height={24}
                                />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4">
                        {/* Ejemplo de items en el carrito */}
                        <div className="space-y-4">
                            <div className="flex items-center space-x-4 bg-whitedark dark:bg-dark p-3 rounded-lg">
                                <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                                    <Image
                                        src="/icons/logo.png"
                                        alt="Producto"
                                        width={64}
                                        height={64}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1 text-dark dark:text-white">
                                    <h3 className="font-medium">Amigurumi Gato</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Cantidad: 1</p>
                                    <p className="text-primary font-medium">$25.00</p>
                                </div>
                                <button className="text-red-500 hover:text-red-600">
                                    <FaTrash />
                                </button>
                            </div>

                            <div className="flex items-center space-x-4 bg-whitedark dark:bg-dark p-3 rounded-lg">
                                <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                                    <Image
                                        src="/icons/logo.png"
                                        alt="Producto"
                                        width={64}
                                        height={64}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1 text-dark dark:text-white">
                                    <h3 className="font-medium">Amigurumi Perro</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Cantidad: 1</p>
                                    <p className="text-primary font-medium">$30.00</p>
                                </div>
                                <button className="text-red-500 hover:text-red-600">
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 border-t dark:border-gray-700">
                        <div className="mb-4">
                            <div className="flex justify-between mb-2">
                                <span>Subtotal</span>
                                <span>$55.00</span>
                            </div>
                            <div className="flex justify-between font-semibold">
                                <span>Total</span>
                                <span>$55.00</span>
                            </div>
                        </div>
                        <button className="w-full bg-primary text-white py-3 rounded-lg hover:bg-opacity-90 transition-colors">
                            Proceder al pago
                        </button>
                    </div>
                </div>
            </div>

            {/* Menú móvil */}
            {isMobileMenuOpen && (
                <div className="px-4 pb-4 bg-primary">
                    <ul className="space-y-4 text-sm font-semibold">
                        <li><a href="/" className="block hover:text-secondary transition-colors">INICIO</a></li>
                        <li><a href="/" className="block hover:text-secondary transition-colors">PRODUCTOS</a></li>
                        <li><a href="/tienda/amigurumi" className="block hover:text-secondary transition-colors">COTIZA TU AMIGURUMI</a></li>
                        <li><a href="/tienda/sobremi" className="block hover:text-secondary transition-colors">SOBRE MI</a></li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default MobileNavbar;