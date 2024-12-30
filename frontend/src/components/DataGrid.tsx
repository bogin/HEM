import { GridConfig } from '@/types';

interface DataGridProps<T> {
    data: T[];
    config: GridConfig<T>;
    onRowClick?: (row: T) => void;
    selectedRows?: number[];
}

export function DataGrid<T extends { id: number }>({ 
    data, 
    config, 
    onRowClick,
    selectedRows = [] 
}: DataGridProps<T>) {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        {config.columns.map((column) => (
                            <th
                                key={String(column.key)}
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                {column.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {data.map((row) => {
                        const isSelected = selectedRows.includes(row.id);
                        return (
                            <tr 
                                key={row.id}
                                onClick={() => onRowClick && onRowClick(row)}
                                className={`
                                    ${onRowClick ? 'cursor-pointer' : ''}
                                    ${isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'}
                                    transition-colors duration-150 ease-in-out
                                `}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && onRowClick) {
                                        onRowClick(row);
                                    }
                                }}
                            >
                                {config.columns.map((column) => (
                                    <td
                                        key={String(column.key)}
                                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                                    >
                                        {String(row[column.key])}
                                    </td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}