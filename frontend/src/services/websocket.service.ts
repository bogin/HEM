import { WS_BASE_URL } from '@/config/constants';
import { MessageCallback } from '@/types';

class WebSocketService {
    private connections: Map<number, WebSocket> = new Map();
    private callbacks: Map<number, Set<MessageCallback>> = new Map();
    private reconnectAttempts: Map<number, number> = new Map();
    private readonly MAX_RECONNECT_ATTEMPTS = 5;

    connect(personId: number, onMessage: MessageCallback) {

        this.disconnect(personId, onMessage);

        const wsUrl = `${WS_BASE_URL}/persons/${personId}`;
        console.log(`Connecting to: ${wsUrl}`);

        const ws = new WebSocket(wsUrl);

        ws.addEventListener('open', (event) => {
            this.connections.set(personId, ws);

            if (!this.callbacks.has(personId)) {
                this.callbacks.set(personId, new Set());
            }
            this.callbacks.get(personId)?.add(onMessage);

            this.reconnectAttempts.set(personId, 0);
        });

        ws.addEventListener('message', (event) => {
            try {
                const message = JSON.parse(event.data);
                this.callbacks.get(personId)?.forEach(callback => callback(message));
            } catch (error) {
                console.error('Error parsing message:', error);
            }
        });

        ws.addEventListener('error', (error) => {
            console.error('WebSocket Error:', error);
            this.handleConnectionError(personId, onMessage);
        });

        ws.addEventListener('close', (event) => {

            this.connections.delete(personId);

            const attempts = (this.reconnectAttempts.get(personId) || 0) + 1;
            this.reconnectAttempts.set(personId, attempts);

            if (attempts <= this.MAX_RECONNECT_ATTEMPTS) {
                const reconnectDelay = Math.min(3000 * attempts, 30000);
                setTimeout(() => this.connect(personId, onMessage), reconnectDelay);
            } else {
                this.callbacks.delete(personId);
                this.reconnectAttempts.delete(personId);
            }
            console.groupEnd();
        });

        this.connections.set(personId, ws);
    }

    private handleConnectionError(personId: number, onMessage: MessageCallback) {
        this.connections.delete(personId);

        const attempts = (this.reconnectAttempts.get(personId) || 0) + 1;
        this.reconnectAttempts.set(personId, attempts);

        if (attempts <= this.MAX_RECONNECT_ATTEMPTS) {
            const reconnectDelay = Math.min(3000 * attempts, 30000);
            setTimeout(() => this.connect(personId, onMessage), reconnectDelay);
        } else {
            this.callbacks.delete(personId);
            this.reconnectAttempts.delete(personId);
        }
    }

    disconnect(personId: number, callback: MessageCallback) {
        const callbacks = this.callbacks.get(personId);
        if (callbacks) {
            callbacks.delete(callback);
            if (callbacks.size === 0) {
                const ws = this.connections.get(personId);
                if (ws) {
                    ws.close(1000, 'Client disconnected');
                    this.connections.delete(personId);
                    this.callbacks.delete(personId);
                    this.reconnectAttempts.delete(personId);
                }
            }
        }
    }
}

export const wsService = new WebSocketService();