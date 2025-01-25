'use client'

import React from 'react';
import Loader from '@/components/loader';

const Admin = () => {
    return (
        <div>
            <Loader duration={1000} />

            <h1>Admin Panel</h1>
            <p>Bienvenido al panel de administración.</p>
        </div>
    );
};

export default Admin;