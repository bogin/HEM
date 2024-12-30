import React from 'react';
import { useSelectedPerson } from '../hooks/usePersonQueries';
import { useNavigate } from 'react-router-dom';

export const DashboardView = () => {
    const { selectedPerson } = useSelectedPerson();
    const navigate = useNavigate();

    React.useEffect(() => {
        if (!selectedPerson) {
            navigate('/');
        }
    }, [selectedPerson, navigate]);

    if (!selectedPerson) {
        return (
            <div className="text-center text-gray-600 p-8">
                Please select a person first
            </div>
        );
    }

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">
                Dashboard for {selectedPerson.name}
            </h2>
            {/* WebSocket visualization will go here */}
        </div>
    );
};