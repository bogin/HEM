import { SENSOR_COLORS } from "@/config/constants";
import { WebSocketData } from "@/types";
import { FC } from "react";
import { ResponsiveContainer, LineChart, XAxis, YAxis, Tooltip, Legend, Line } from "recharts";

interface SensorChartProps {
    data: WebSocketData[];
}

export const SensorChart: FC<SensorChartProps> = ({ data }) => (
    <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.map(d => ({
                timestamp: d.timestamp,
                ...JSON.parse(d.data).reduce((acc: Record<string, number>, val: number, i: number) => {
                    acc[`sensor${i + 1}`] = val;
                    return acc;
                }, {})
            }))}
                key={`chart-${data.length}`} >
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
);