import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelectedPersons } from '@/hooks/usePersonQueries';
import { useWebSocket } from '@/hooks/useWebSocket';
import { DashboardHeader } from '@/components/DashboardHeader';
import { SensorChart } from '@/components/SensorChart';
import { SensorStats } from '@/components/SensorStats';

export const DashboardView = () => {
    const { personId } = useParams();
    const navigate = useNavigate();
    const { selectedPersons } = useSelectedPersons();
    const { data, status, actualRate } = useWebSocket(Number(personId));

    const selectedPerson = selectedPersons.find(p => p.id === Number(personId));

    React.useEffect(() => {
        if (!selectedPerson) {
            navigate('/');
        }
    }, [selectedPerson, navigate]);

    if (!selectedPerson) return null;

    return (
        <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-4">
                <DashboardHeader
                    name={selectedPerson.name}
                    status={status}
                    actualRate={actualRate}
                />
                <SensorChart data={data} key={personId} />
                <SensorStats data={data} />
            </div>
        </div>
    );
};

