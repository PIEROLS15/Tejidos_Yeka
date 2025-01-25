'use client'

import { useSession } from "next-auth/react";

const HomePage = () => {
    const { data: session } = useSession();

    if (!session || !session.user || !session.user.name) {
        return <div>No session or name not available</div>;
    }

    const firstName = session.user.name.split(' ')[0];
    return (
        <div>
            <p>Name: {firstName}</p>
            <p>Role: {session.user.role}</p>
            <p>Apellidos: {session.user.apellidos}</p>
            <p>Celular: {session.user.celular}</p>
            <p>Código de País: {session.user.codigo_pais}</p>
            <p>Rol Nombre: {session.user.rolNombre}</p>
        </div>
    );
}

export default HomePage;