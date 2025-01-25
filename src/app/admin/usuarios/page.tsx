'use client'

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Loader from '@/components/loader';
import ReusableTable from '@/components/ui/tables';
import { FaEye, FaEdit } from "react-icons/fa";

interface User {
    id: number;
    correo: string;
    nombres: string;
    apellidos: string;
    id_rol: number;
    id_google: number;
    celular?: string;
    codigo_pais?: string;
    creado_en: string;
}

interface Role {
    id: number;
    nombre: string;
}

const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

const UsersTable = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [rolesList, setRolesList] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<number | null>(null);

    const updateUserRole = async (userId: number, newRoleId: number) => {
        setUpdating(userId);
        try {
            const response = await fetch(`/api/usuarios?id=${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id_rol: newRoleId }),
            });

            if (!response.ok) {
                throw new Error('Error al actualizar el rol');
            }

            setUsers(users.map(user =>
                user.id === userId ? { ...user, id_rol: newRoleId } : user
            ));

            toast.success('Rol actualizado con éxito');
        } catch (error) {
            console.error('Error updating role:', error);
            toast.error('Error al actualizar el rol');
        } finally {
            setUpdating(null);
        }
    };

    const headers = [
        'ID',
        'Correo',
        'Nombres',
        'Apellidos',
        'Rol',
        'Celular',
        'Código País',
        'Usuario Google',
        'Creado',
        'Acciones'
    ];

    useEffect(() => {
        Promise.all([
            fetch('/api/usuarios'),
            fetch('/api/roles')
        ])
            .then(([usersResponse, rolesResponse]) =>
                Promise.all([usersResponse.json(), rolesResponse.json()])
            )
            .then(([usersData, rolesData]: [User[], Role[]]) => {
                setUsers(usersData);
                setRolesList(rolesData);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });
    }, []);

    const tableData = users.map(user => ({
        id: user.id,
        correo: user.correo,
        nombres: user.nombres,
        apellidos: user.apellidos,
        rol: (
            <select
                value={user.id_rol}
                onChange={(e) => updateUserRole(user.id, Number(e.target.value))}
                disabled={updating === user.id}
                className="p-2 border rounded"
            >
                {rolesList.map(role => (
                    <option key={role.id} value={role.id}>
                        {capitalizeFirstLetter(role.nombre)}
                    </option>
                ))}
            </select>
        ),
        celular: user.celular || 'Sin agregar',
        codigo_pais: user.codigo_pais || 'Sin agregar',
        id_google: user.id_google ? 'Sí' : 'No',
        creado_en: new Date(user.creado_en).toLocaleDateString(),
        acciones: (
            <div className="flex space-x-2">
                <button className="bg-[#0674A2] p-2 rounded-lg text-white flex items-center">
                    <FaEye className="mr-2" />
                    Ver
                </button>
                <button className="bg-[#28A745] p-2 rounded-lg text-white flex items-center">
                    <FaEdit className="mr-2" />
                    Editar
                </button>
            </div>
        )
    }));

    return (
        <div className="p-4">
            <Loader duration={1000} />
            <h1 className="text-2xl font-bold mb-4">Lista de Usuarios</h1>

            <ReusableTable
                headers={headers}
                data={tableData}
                itemsPerPage={10}
            />

        </div>
    );
};

export default UsersTable;