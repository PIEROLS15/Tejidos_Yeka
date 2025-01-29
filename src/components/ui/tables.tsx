import React, { useState } from 'react';

// Definimos las interfaces para nuestros props y datos
export interface TableRow {
    [key: string]: string | number | JSX.Element;
}

interface ReusableTableProps {
    headers: string[];
    data: TableRow[];
    itemsPerPage?: number;
}

const ReusableTable: React.FC<ReusableTableProps> = ({
    headers,
    data,
    itemsPerPage = 5
}) => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [searchTerm, setSearchTerm] = useState<string>('');

    // Filtrar datos según el término de búsqueda
    const filteredData = data.filter((item: TableRow) =>
        Object.values(item).some(value =>
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    // Calcular paginación
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = filteredData.slice(startIndex, endIndex);

    // Manejar cambio de página
    const handlePageChange = (page: number): void => {
        setCurrentPage(page);
    };

    return (
        <div className="w-full">
            {/* Barra de búsqueda */}
            <div className="mb-4">
                <input
                    type="search"
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                    className="px-4 py-2 border rounded-lg w-full max-w-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darklight dark:text-white"
                />
            </div>

            {/* Tabla */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-primary dark:border-white">
                    <thead className="bg-primary">
                        <tr>
                            {headers.map((header: string, index: number) => (
                                <th
                                    key={index}
                                    className="px-6 py-3 text-xs text-center font-medium text-white uppercase tracking-wider border-b"
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-primary dark:divide-white">
                        {currentData.map((row: TableRow, rowIndex: number) => (
                            <tr
                                key={rowIndex}
                                className={`${rowIndex % 2 === 0 ? 'bg-white dark:bg-dark' : 'bg-gray-100 dark:bg-darklight'}`}
                            >
                                {Object.values(row).map((cell: string | number | JSX.Element, cellIndex: number) => (
                                    <td
                                        key={cellIndex}
                                        className="px-6 py-4 whitespace-nowrap text-center text-sm text-darklight dark:text-white"
                                    >
                                        {cell}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>


            {/* Paginación */}
            <div className="flex items-center justify-center space-x-1 mt-4">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-md ${currentPage === 1
                        ? 'bg-white text-gray-400 cursor-not-allowed dark:bg-dark dark:text-gray-300'
                        : 'bg-primary text-white hover:bg-secondary'
                        }`}
                >
                    Anterior
                </button>

                {[...Array(totalPages)].map((_, index: number) => (
                    <button
                        key={index}
                        onClick={() => handlePageChange(index + 1)}
                        className={`px-3 py-1 rounded-none ${currentPage === index + 1
                            ? 'bg-primary text-white'
                            : 'bg-white hover:bg-gray-200 text-primary  dark:bg-darklight dark:hover:bg-gray-200 dark:text-white dark:hover:text-primary'
                            }`}
                    >
                        {index + 1}
                    </button>
                ))}

                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-md ${currentPage === totalPages
                        ? 'bg-white text-gray-400 cursor-not-allowed dark:bg-dark dark:text-gray-300'
                        : 'bg-primary text-white hover:bg-secondary'
                        }`}
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
};

export default ReusableTable;