import React from 'react';

interface SaveButtonProps {
    onClick?: () => void;
    isLoading?: boolean;
    disabled?: boolean;
}

const SaveButton: React.FC<SaveButtonProps> = ({ onClick, isLoading = false, disabled = false, }) => {
    return (
        <button
            type="submit"
            onClick={onClick}
            disabled={disabled || isLoading}
            className={`px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary disabled:opacity-50 `}
        >
            {isLoading ? 'Guardando...' : 'Guardar'}
        </button>
    );
};

export default SaveButton;
