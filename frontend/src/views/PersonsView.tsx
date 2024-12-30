import { Person, GridConfig } from '../types';
import { DataGrid } from '../components/DataGrid';
import { Loading } from '../components/Loading';
import { usePersons, useSelectedPerson } from '../hooks/usePersonQueries';

const gridConfig: GridConfig<Person> = {
    columns: [
        { key: 'id', header: 'ID' },
        { key: 'name', header: 'Name' }
    ]
};

export const PersonsView = () => {
    const { data: persons, isLoading, error } = usePersons();
    const { selectedPerson, setSelectedPerson } = useSelectedPerson();

    if (isLoading) return <Loading />;
    if (error) return <div>Error loading persons</div>;
    if (!persons) return null;

    return (
        <div className="space-y-6">
            {selectedPerson && (
                <div className="bg-white shadow rounded-lg p-4 flex justify-between items-center">
                    <div>
                        Selected: {selectedPerson.name} (ID: {selectedPerson.id})
                    </div>
                    <button
                        onClick={() => setSelectedPerson(null)}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                    >
                        Remove
                    </button>
                </div>
            )}
            <div className="bg-white shadow rounded-lg overflow-hidden">
                <DataGrid
                    data={persons}
                    config={gridConfig}
                    onRowClick={setSelectedPerson}
                />
            </div>
        </div>
    );
};