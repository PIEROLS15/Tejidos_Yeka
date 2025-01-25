'use client'
import ThemeToggle from "./themeToggle";
import { useSession } from "next-auth/react";
import { FaRegUserCircle } from "react-icons/fa";

const AdminNavbar = () => {
    const { data: session } = useSession();

    if (!session || !session.user || !session.user.name) {
        return <div>La sesion no existe.</div>;
    }

    const firstName = session.user.name.split(' ')[0];

    // Convertir la primera letra del rol en mayúscula, si existe
    const roleName = session?.user?.rolNombre
        ? session.user.rolNombre.charAt(0).toUpperCase() + session.user.rolNombre.slice(1).toLowerCase()
        : '';

    return (
        <nav className="flex items-center bg-white p-4 space-x-2 dark:bg-dark">
            <ThemeToggle />
            <div className="flex justify-between items-center">
                <div className="flex flex-col items-start">
                    <span className="text-[11px] xl:text-[12px] 2xl:text-[14px] text-dark cursor-pointer font-semibold dark:text-white">
                        {`${firstName} ${session.user.apellidos}`}
                    </span>
                    <span className="text-[11px] xl:text-[12px] 2xl:text-[14px] text-dark cursor-pointer font-semibold dark:text-white">
                        {roleName}
                    </span>
                </div>
                <div className="flex items-center">
                    <FaRegUserCircle className="text-dark text-5xl dark:text-white" />
                </div>
            </div>
        </nav>
    );
}

export default AdminNavbar;
