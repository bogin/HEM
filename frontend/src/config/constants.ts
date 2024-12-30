import { GridConfig, Person } from "@/types";

export const WS_BASE_URL = process.env.REACT_APP_WS_URL;

if (!WS_BASE_URL) {
    throw new Error('WS_URL is not defined in environment variables');
}

export const API_BASE_URL = process.env.REACT_APP_API_URL;
export const MAX_SELECTED_PERSONS = 4;

export const QUERY_KEYS = {
    PERSONS: ['persons'],
    SELECTED_PERSONS: ['selectedPersons'],
} as const;

export const gridConfig: GridConfig<Person> = {
    columns: [
        { key: 'id', header: 'ID' },
        { key: 'name', header: 'Name' },
        { key: 'age', header: 'Age' }
    ]
};

export const SENSOR_COLORS = [
    "#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#0088FE",
    "#00C49F", "#FFBB28", "#FF8042", "#a4de6c", "#d0ed57",
    "#8e44ad", "#3498db", "#e74c3c", "#2ecc71", "#f1c40f",
    "#9b59b6", "#34495e", "#1abc9c", "#e67e22"
];
