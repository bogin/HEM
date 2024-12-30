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