import React from 'react';
import { GridConfig } from '../types';

interface DataGridProps<T> {
    data: T[];
    config: GridConfig<T>;
    onRowClick?: (row: T) => void;
}

export function DataGrid<T>({ data, config, onRowClick }: DataGridProps<T>) {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        {config.columns.map((column) => (
                            <th
                                key={column.key}
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                {column.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {data.map((row, idx) => (
                        <tr 
                            key={idx}
                            onClick={() => onRowClick?.(row)}
                            className="hover:bg-gray-50 cursor-pointer"
                        >
                            {config.columns.map((column) => (
                                <td
                                    key={column.key}
                                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                                >
                                    {String(row[column.key])}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}