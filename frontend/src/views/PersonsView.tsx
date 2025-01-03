import { Person } from '@/types';
import { DataGrid } from '@/components/DataGrid';
import { Loading } from '@/components/Loading';
import { usePersons, useSelectedPersons } from '@/hooks/usePersonQueries';
import { gridConfig, MAX_SELECTED_PERSONS } from '@/config/constants';

export const PersonsView = () => {
    const { data: persons, isLoading, error } = usePersons();
    const { selectedPersons, togglePersonSelection } = useSelectedPersons();

    const handleRowClick = (person: Person) => {
        togglePersonSelection(person);
    };

    if (isLoading) return <Loading />;
    if (error) return (
        <div className="text-red-500 text-center">
            Error loading persons. <button onClick={() => window.location.reload()}>Retry</button>
        </div>
    );
    if (!persons) return null;

    return (
        <div className="space-y-6">
            {selectedPersons.length > 0 && (
                <div className="bg-white shadow rounded-lg p-4">
                    <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-600">
                            Selected Persons ({selectedPersons.length}/{MAX_SELECTED_PERSONS}):
                        </div>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                        {selectedPersons.map(person => (
                            <div
                                key={person.id}
                                className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full truncate"
                                title={person.name}
                            >
                                <span>{person.name}</span>
                                <button
                                    onClick={() => togglePersonSelection(person)}
                                    className="ml-2 text-blue-500 hover:text-blue-700"
                                    aria-label={`Deselect ${person.name}`}
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <DataGrid
                    data={persons}
                    config={gridConfig}
                    onRowClick={handleRowClick}
                    selectedRows={selectedPersons.map(p => p.id)}
                />
            </div>
        </div>
    );
};
