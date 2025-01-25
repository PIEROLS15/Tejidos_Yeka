import { IoMdAddCircle } from "react-icons/io";

interface ButtonNewAdminProps {
    onClick: () => void;
}

const ButtonNewAdmin: React.FC<ButtonNewAdminProps> = ({ onClick }) => {
    return (
        <button onClick={onClick} className="flex bg-primary rounded-[15px] px-4 py-2 text-white items-center space-x-3">
            <IoMdAddCircle className="text-2xl" />
            <span>Nuevo</span>
        </button>
    );
}

export default ButtonNewAdmin;