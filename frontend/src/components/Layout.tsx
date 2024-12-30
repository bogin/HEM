import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

export const Layout = () => {
    const location = useLocation();

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex space-x-8">
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
                            <Link 
                                to="/dashboard" 
                                className={`${
                                    location.pathname === '/dashboard' 
                                    ? 'text-blue-600' 
                                    : 'text-gray-600 hover:text-blue-600'
                                } px-3 py-2 text-sm font-medium`}
                            >
                                Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>
            <main className="max-w-7xl mx-auto py-6 px-4">
                <Outlet />
            </main>
        </div>
    );
}