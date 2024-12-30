import { SensorStat, WebSocketData } from "@/types";
import { FC } from "react";

interface SensorStatsProps {
    data: WebSocketData[];
}

interface SensorStatCardProps {
    sensorIndex: number;
    stat: SensorStat;
}


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


export const SensorStats: FC<SensorStatsProps> = ({ data }) => {
    const stats = calculateStats(data);

    return (
        <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Last 10 Seconds Analysis</h3>
            <div className="grid grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <SensorStatCard key={i} sensorIndex={i} stat={stat} />
                ))}
            </div>
        </div>
    )
};

export const SensorStatCard: FC<SensorStatCardProps> = ({ sensorIndex, stat }) => (
    <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
        <div className="text-sm font-medium mb-2">Sensor {sensorIndex + 1}</div>
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
);