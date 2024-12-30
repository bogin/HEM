export interface Person {
    id: number;
    name: string;
}

export interface Sample {
    id: number;
    person_id: number;
    timestamp: number;
    data: number[];
}

export interface LazyLoadQuery {
    lastId?: number;
    limit: number;
}

export interface LazyLoadResponse<T> {
    data: T[];
    hasMore: boolean;
    nextCursor?: number;
}