'use client'

import React, { useEffect, useState } from 'react';
import Loader from '@/components/loader';
import ReusableTable from '@/components/ui/tables';

interface Role {
    id: number;
    nombre: string;
}

const RolesTable = () => {
    const [rolesList, setRolesList] = useState<Role[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [filteredRoles, setFilteredRoles] = useState<Role[]>([]);

    // Función para poner la primera letra en mayúscula
    const capitalizeFirstLetter = (str: string) => {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    // Definir las columnas de la tabla
    const headers = [
        'ID',
        'Rol'
    ];

    useEffect(() => {
        // Obtener los datos de roles
        fetch('/api/roles')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data: Role[]) => {
                setRolesList(data);
                setFilteredRoles(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching roles:', error);
                setLoading(false);
            });
    }, []);

    const tableData = rolesList.map(rolesList => ({
        id: rolesList.id,
        nombre: rolesList.nombre,
    }));

    return (
        <div className="p-4">
            <Loader duration={1000} />
            <h1 className="text-2xl font-bold mb-4">Lista de Roles</h1>

            <ReusableTable
                headers={headers}
                data={tableData}
                itemsPerPage={10}
            />
        </div>
    );
}

export default RolesTable;
