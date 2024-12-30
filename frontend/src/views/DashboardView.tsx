import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useSelectedPersons } from '@/hooks/usePersonQueries';
import { useWebSocket } from '@/hooks/useWebSocket';
import { WebSocketData } from '@/types';

const SENSOR_COLORS = [
    "#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#0088FE",
    "#00C49F", "#FFBB28", "#FF8042", "#a4de6c", "#d0ed57",
    "#8e44ad", "#3498db", "#e74c3c", "#2ecc71", "#f1c40f",
    "#9b59b6", "#34495e", "#1abc9c", "#e67e22"
];

const calculateStats = (data: WebSocketData[]) => {
    const tenSecondsAgo = Date.now() - 10000;
    const recentData = data.filter(d => d.timestamp * 1000 > tenSecondsAgo);

    if (recentData.length === 0) {
        return Array.from({ length: 19 }, () => ({ avg: 0, std: 0, min: 0, max: 0, samples: 0 }));
    }

    return Array.from({ length: 19 }, (_, sensorIndex) => {
        const sensorValues = recentData.map(d => JSON.parse(d.data)[sensorIndex]);

        const min = Math.min(...sensorValues);
        const max = Math.max(...sensorValues);
        const avg = sensorValues.reduce((a, b) => a + b, 0) / sensorValues.length;
        const std = Math.sqrt(
            sensorValues.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / sensorValues.length
        );

        return {
            avg,
            std,
            min,
            max,
            samples: sensorValues.length
        };
    });
};

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

    const stats = calculateStats(data);

    return (
        <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">
                        {selectedPerson.name}'s Sensor Data
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

                <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data.map(d => ({
                            timestamp: d.timestamp,
                            ...JSON.parse(d.data).reduce((acc: Record<string, number>, val: number, i: number) => {
                                acc[`sensor${i + 1}`] = val;
                                return acc;
                            }, {})
                        }))}>
                            <XAxis
                                dataKey="timestamp"
                                domain={['auto', 'auto']}
                                tickFormatter={(ts) => new Date(ts * 1000).toLocaleTimeString()}
                            />
                            <YAxis
                                domain={[
                                    (dataMin: number) => Math.floor(dataMin * 1.25),
                                    (dataMax: number) => Math.ceil(dataMax * 1.25)
                                ]}
                            />
                            <Tooltip
                                labelFormatter={(ts) => new Date(ts * 1000).toLocaleTimeString()}
                            />
                            <Legend />
                            {Array.from({ length: 19 }, (_, i) => (
                                <Line
                                    key={i}
                                    type="monotone"
                                    dataKey={`sensor${i + 1}`}
                                    name={`Sensor ${i + 1}`}
                                    stroke={SENSOR_COLORS[i % SENSOR_COLORS.length]}
                                    dot={false}
                                    isAnimationActive={false}
                                />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3">Last 10 Seconds Analysis</h3>
                    <div className="grid grid-cols-4 gap-4">
                        {stats.map((stat, i) => (
                            <div key={i} className="p-4 bg-gray-50 rounded-lg shadow-sm">
                                <div className="text-sm font-medium mb-2">Sensor {i + 1}</div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Samples:</span>
                                        <span className="font-medium">{stat.samples}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Range:</span>
                                        <span className="font-medium">
                                            {stat.min.toFixed(1)} to {stat.max.toFixed(1)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Average:</span>
                                        <span className="font-medium">{stat.avg.toFixed(1)}</span>
                                    </div>
                                    <div className="flex justify-between" title="Higher values indicate more volatile readings">
                                        <span className="text-gray-600">Volatility:</span>
                                        <span className="font-medium">±{stat.std.toFixed(1)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
