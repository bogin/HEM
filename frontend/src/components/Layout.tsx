import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useSelectedPersons } from '@/hooks/usePersonQueries';
import { MAX_SELECTED_PERSONS } from '@/config/constants';
import { useState } from 'react';

export const Layout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { selectedPersons } = useSelectedPersons();
    const [isNavigating, setIsNavigating] = useState(false);

    const handleNavigation = async (path: string) => {
        if (isNavigating) return;
        if (location.pathname === path) return;

        setIsNavigating(true);
        try {
            await navigate(path);
        } finally {
            setTimeout(() => setIsNavigating(false), 500);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex space-x-4">
                            <button
                                onClick={() => handleNavigation('/')}
                                disabled={isNavigating}
                                className={`${location.pathname === '/'
                                    ? 'text-blue-600'
                                    : 'text-gray-600 hover:text-blue-600'
                                    } px-3 py-2 text-sm font-medium ${isNavigating ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                            >
                                Persons
                            </button>
                            {selectedPersons.map(person => (
                                <button
                                    key={person.id}
                                    onClick={() => handleNavigation(`/dashboard/${person.id}`)}
                                    disabled={isNavigating}
                                    className={`${location.pathname === `/dashboard/${person.id}`
                                        ? 'text-blue-600'
                                        : 'text-gray-600 hover:text-blue-600'
                                        } px-3 py-2 text-sm font-medium ${isNavigating ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                >
                                    {person.name}'s Dashboard
                                </button>
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