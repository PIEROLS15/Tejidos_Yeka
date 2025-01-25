'use client'

import { FaEye, FaEdit } from "react-icons/fa";

const ButtonsActionsAdmin = () => {
    return (
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
    );
}

export default ButtonsActionsAdmin;