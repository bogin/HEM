import React from 'react';
import { usePersonContext } from '../context/PersonContext';

export const DashboardView = () => {
    const { selectedPerson } = usePersonContext();

    if (!selectedPerson) {
        return (
            <div className="text-center text-gray-600">
                Please select a person first
            </div>
        );
    }

    return (
        <div>
            Dashboard for {selectedPerson.name}
            {/* WebSocket visualization will go here */}
        </div>
    );
};