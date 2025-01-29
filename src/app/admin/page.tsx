'use client';

import Loader from '@/components/loader';
import React, { useEffect, useState } from 'react';
import { FaUsers, FaShoppingCart } from "react-icons/fa";
import Link from 'next/link';

const Admin = () => {
    const [totalUsers, setTotalUsers] = useState<number>(0);
    const [totalProducts, setTotalProducts] = useState<number>(0);

    //Obtenemos el total de usuarios
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('/api/usuarios');
                if (!response.ok) {
                    throw new Error('Error al obtener los usuarios');
                }
                const data = await response.json();
                setTotalUsers(data.length);
            } catch (error) {
                console.error(error);
                setTotalUsers(0);
            }
        };

        fetchUsers();
    }, []);

    //Obtenemos el total de productos
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('/api/productos');
                if (!response.ok) {
                    throw new Error('Error al obtener los productos');
                }
                const data = await response.json();
                setTotalProducts(data.length);
            } catch (error) {
                console.error(error);
                setTotalProducts(0);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className='p-4'>
            <Loader duration={1000} />
            <h1 className='text-2xl font-bold text-dark dark:text-white'>Dashboard</h1>
            <div className='mt-4'>
                <div className='flex flex-row space-x-5 w-full justify-between'>

                    <Link href={'admin/usuarios'} className='flex flex-1'>
                        <div className='flex flex-1 p-4 bg-white rounded-lg dark:bg-dark'>
                            <div className='rounded-full bg-primary p-4'>
                                <FaUsers className='text-3xl text-white' />
                            </div>
                            <div className='mx-5 text-dark dark:text-white space-y-2'>
                                <strong className='text-xl'>{totalUsers}</strong>
                                <div>Total Usuarios</div>
                            </div>
                        </div>
                    </Link>

                    <Link href={'admin/productos'} className='flex flex-1'>
                        <div className='flex flex-1 p-4 bg-white rounded-lg dark:bg-dark'>
                            <div className='rounded-full bg-primary p-4'>
                                <FaShoppingCart className='text-3xl text-white' />
                            </div>
                            <div className='mx-5 text-dark dark:text-white space-y-2'>
                                <strong className='text-xl'>{totalProducts}</strong>
                                <div>Total Productos</div>
                            </div>
                        </div>
                    </Link>

                </div>
            </div>
        </div>
    );
};

export default Admin;
