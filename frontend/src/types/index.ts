export interface Person {
    id: number;
    name: string;
}

export interface GridConfig<T> {
    columns: {
        key: Extract<keyof T, string>;
        header: string;
    }[];
}