import React, { useEffect } from 'react';
import { Person, GridConfig } from '../types';
import { DataGrid } from '../components/DataGrid';
import { Loading } from '../components/Loading';
import { usePersonStore } from '../stores/personStore'; 

const gridConfig: GridConfig<Person> = {
    columns: [
        { key: 'id', header: 'ID' },
        { key: 'name', header: 'Name' }
    ]
};

export const PersonsView = () => {
    const { 
        persons, 
        selectedPerson, 
        loading, 
        error,
        fetchPersons, 
        selectPerson 
    } = usePersonStore();

    useEffect(() => {
        fetchPersons();
    }, [fetchPersons]);

    if (loading) return <Loading />;
    if (error) return (
        <div className="text-red-500 text-center p-4">
            Error: {error}
        </div>
    );

    return (
        <div className="space-y-6">
            {selectedPerson && (
                <div className="bg-white shadow rounded-lg p-4 flex justify-between items-center">
                    <div>
                        Selected: {selectedPerson.name} (ID: {selectedPerson.id})
                    </div>
                    <button
                        onClick={() => selectPerson(null)}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Remove
                    </button>
                </div>
            )}
            <DataGrid 
                data={persons} 
                config={gridConfig} 
                onRowClick={selectPerson}
            />
        </div>
    );
};
