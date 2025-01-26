"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { TfiWorld } from 'react-icons/tfi';
import { FaUsers, FaShoppingCart, FaShoppingBasket } from 'react-icons/fa';
import { FaUsersGear } from 'react-icons/fa6';
import { MdDashboard, MdOutlineRequestQuote, MdCategory, MdExpandMore, MdInvertColors } from "react-icons/md";
import { RiDiscountPercentFill } from "react-icons/ri";


const Sidebar = () => {
    const pathname = usePathname();
    const [isDropdownOpen, setDropdownOpen] = useState(false);

    const linkStyles = "flex items-center space-x-4 py-2 px-4 rounded-lg hover:bg-secondary hover:text-white transition-colors text-dark dark:text-white";

    // Función para aplicar estilo cuando estamos en la ruta
    const getLinkStyles = (ruta: string) => pathname === ruta ? 'bg-primary text-white' : '';

    // Rutas dentro del dropdown
    const dropdownRoutes = ["/admin/productos", "/admin/productos/nuevoproducto"];

    // Verificar si alguna de las rutas está activa para aplicar estilo al botón del dropdown
    const isDropdownActive = dropdownRoutes.includes(pathname);

    return (
        <div className="h-screen w-64 bg-white flex flex-col dark:bg-dark">
            <h2 className="text-xl font-bold p-6 border-b border-primary text-center text-primary dark:text-white dark:border-white">
                Tejidos Yeka Admin
            </h2>
            <nav className="flex flex-col p-4 space-y-4">
                <Link href="/admin" className={`${linkStyles} ${getLinkStyles('/admin')}`}>
                    <MdDashboard className="text-xl w-6" />
                    <span>Dashboard</span>
                </Link>
                <Link href="/" className={`${linkStyles} ${getLinkStyles('/')}`}>
                    <TfiWorld className="text-xl w-6" />
                    <span>Sitio web</span>
                </Link>
                <Link href="/admin/usuarios" className={`${linkStyles} ${getLinkStyles('/admin/usuarios')}`}>
                    <FaUsers className="text-xl w-6" />
                    <span>Usuarios</span>
                </Link>
                <Link href="/admin/roles" className={`${linkStyles} ${getLinkStyles('/admin/roles')}`}>
                    <FaUsersGear className="text-xl w-6" />
                    <span>Roles</span>
                </Link>

                {/* Dropdown */}
                <div>
                    <button
                        className={`w-full ${linkStyles} flex justify-between ${isDropdownActive ? 'bg-primary text-white' : ''}`}
                        onClick={() => setDropdownOpen(!isDropdownOpen)}
                    >
                        <div className='flex space-x-4'>
                            <FaShoppingCart className="text-xl w-6" />
                            <span>Productos</span>
                        </div>
                        <MdExpandMore className={`text-xl w-6 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
                    </button>
                    {isDropdownOpen && (
                        <div className="ml-6 flex flex-col space-y-2">
                            <Link href="/admin/productos"
                                className={`${linkStyles} mt-2 ${getLinkStyles('/admin/productos')}`}
                                onClick={() => setDropdownOpen(false)}
                            >
                                <span> Ver Productos</span>
                            </Link>
                            <Link href="/admin/productos/nuevoproducto"
                                className={`${linkStyles} ${getLinkStyles('/admin/productos/nuevoproducto')}`}
                                onClick={() => setDropdownOpen(false)}
                            >
                                <span>Agregar Producto</span>
                            </Link>
                        </div>
                    )}
                </div>

                <Link href="/admin/pedidos" className={`${linkStyles} ${getLinkStyles('/admin/pedidos')}`}>
                    <FaShoppingBasket className="text-xl w-6" />
                    <span>Pedidos</span>
                </Link>
                <Link href="/admin/cotizaciones" className={`${linkStyles} ${getLinkStyles('/admin/cotizaciones')}`}>
                    <MdOutlineRequestQuote className="text-xl w-6" />
                    <span>Cotizaciones</span>
                </Link>
                <Link href="/admin/categorias" className={`${linkStyles} ${getLinkStyles('/admin/categorias')}`}>
                    <MdCategory className="text-xl w-6" />
                    <span>Categorias</span>
                </Link>

                <Link href="/admin/colores" className={`${linkStyles} ${getLinkStyles('/admin/colores')}`}>
                    <MdInvertColors className="text-xl w-6" />
                    <span>Colores</span>
                </Link>
                <Link href="/admin/descuentos" className={`${linkStyles} ${getLinkStyles('/admin/descuentos')}`}>
                    <RiDiscountPercentFill className="text-xl w-6" />
                    <span>Descuentos</span>
                </Link>
            </nav>
        </div>
    );
};

export default Sidebar;
