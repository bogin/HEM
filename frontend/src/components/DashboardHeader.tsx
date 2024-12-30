import { FC } from "react";

interface HeaderProps {
    name: string;
    status: 'connecting' | 'connected' | 'error';
    actualRate: number;
}

export const DashboardHeader: FC<HeaderProps> = ({ name, status, actualRate }) => (
    <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
            {name}'s Sensor Data
        </h2>
        <div className="flex items-center gap-4">
            <div className={`
                px-3 py-1 rounded-full text-sm
                ${status === 'connected' ? 'bg-green-100 text-green-800' : ''}
                ${status === 'connecting' ? 'bg-yellow-100 text-yellow-800' : ''}
                ${status === 'error' ? 'bg-red-100 text-red-800' : ''}
            `}>
                {status === 'connected' && 'Connected'}
                {status === 'connecting' && 'Connecting...'}
                {status === 'error' && 'Connection Error'}
            </div>
            <div className="text-sm">
                Rate: {actualRate.toFixed(1)} Hz
            </div>
        </div>
    </div>
);