export interface Person {
    id: number;
    name: string;
    age: number;
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

export interface WebSocketData {
    timestamp: number;
    data: string;
}

export interface WebSocketMessage {
    personId: number;
    timestamp: number;
    data: string;
}

export type MessageCallback = (data: WebSocketMessage) => void;
