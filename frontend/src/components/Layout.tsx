import { Link, Outlet, useLocation } from 'react-router-dom';
import { useSelectedPersons } from '@/hooks/usePersonQueries';
import { MAX_SELECTED_PERSONS } from '@/config/constants';

export const Layout = () => {
    const location = useLocation();
    const { selectedPersons } = useSelectedPersons();

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex space-x-4">
                            <Link 
                                to="/" 
                                className={`${
                                    location.pathname === '/' 
                                    ? 'text-blue-600' 
                                    : 'text-gray-600 hover:text-blue-600'
                                } px-3 py-2 text-sm font-medium`}
                            >
                                Persons
                            </Link>
                            {selectedPersons.map(person => (
                                <Link 
                                    key={person.id}
                                    to={`/dashboard/${person.id}`}
                                    className={`${
                                        location.pathname === `/dashboard/${person.id}` 
                                        ? 'text-blue-600' 
                                        : 'text-gray-600 hover:text-blue-600'
                                    } px-3 py-2 text-sm font-medium`}
                                >
                                    {person.name}'s Dashboard
                                </Link>
                            ))}
                        </div>
                        {selectedPersons.length > 0 && (
                            <div className="text-sm text-gray-500">
                                {selectedPersons.length}/{MAX_SELECTED_PERSONS} selected
                            </div>
                        )}
                    </div>
                </div>
            </nav>
            <main className="py-6 px-4">
                <Outlet />
            </main>
        </div>
    );
};