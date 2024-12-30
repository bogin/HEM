export interface Person {
    id: number;
    name: string;
}

export interface GridConfig<T> {
    columns: {
        key: keyof T;
        header: string;
    }[];
}

export interface WebSocketConnection {
    personId: number;
    status: 'connecting' | 'connected' | 'error';
    socket?: WebSocket;
}