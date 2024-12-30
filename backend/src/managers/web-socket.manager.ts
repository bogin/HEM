import WebSocket from 'ws';
import url from 'url';
import sampleService from '../services/sample.service';
import personService from '../services/person.service';

class WebSocketManager {
    private connections: Map<number, Set<WebSocket>> = new Map();
    private intervals: Map<number, NodeJS.Timeout> = new Map();
    private readonly SAMPLE_RATE_Hz = 120;
    private readonly SAMPLE_INTERVAL = 1000 / this.SAMPLE_RATE_Hz;

    handleWebSocket = (ws: WebSocket, req: any) => {

        const parsedUrl = url.parse(req.url || '', true);
        const pathParts = parsedUrl.pathname?.split('/').filter(Boolean);

        if (!pathParts || pathParts.length !== 2 || pathParts[0] !== 'persons') {
            console.error('Invalid WebSocket connection URL');
            ws.close(1008, 'Invalid Connection URL');
            return;
        }

        const personId = parseInt(pathParts[1]);
        if (isNaN(personId)) {
            console.error('Invalid person ID in WebSocket URL');
            ws.close(1008, 'Invalid Person ID');
            return;
        }

        this.handleConnection(ws, personId);
    };

    async handleConnection(ws: WebSocket, personId: number): Promise<void> {
        try {
            const person = await personService.getPersonById(personId);
            if (!person) {
                ws.close(1008, 'Person Not Found');
                return;
            }

            if (!this.connections.has(personId)) {
                this.connections.set(personId, new Set());
            }
            this.connections.get(personId)?.add(ws);

            if (!this.intervals.has(personId)) {
                await this.startStreaming(personId);
            }

            ws.on('close', () => {
                this.handleDisconnection(ws, personId);
            });

            ws.on('error', () => {
                this.handleDisconnection(ws, personId);
            });

        } catch (error) {
            console.error('Error in handleConnection:', error);
            ws.close(1011, 'Internal Server Error');
        }
    }

    private async startStreaming(personId: number): Promise<void> {
        try {
            const samples = await sampleService.getSamplesForPerson(personId);
            if (samples.length === 0) return;

            let currentSampleIndex = 0;

            const interval = setInterval(() => {
                const connections = this.connections.get(personId);
                if (!connections || connections.size === 0) {
                    this.stopStreaming(personId);
                    return;
                }

                const sample = samples[currentSampleIndex % samples.length];
                const message = JSON.stringify({
                    timestamp: Date.now(),
                    personId: sample.person_id,
                    data: sample.data
                });

                connections.forEach(conn => {
                    if (conn.readyState === WebSocket.OPEN) {
                        conn.send(message);
                    }
                });

                currentSampleIndex++;
            }, this.SAMPLE_INTERVAL);

            this.intervals.set(personId, interval);

        } catch (error) {
            console.error(`Error starting streaming for person ${personId}:`, error);
            this.stopStreaming(personId);
        }
    }

    stopStreaming(personId: number): void {
        const interval = this.intervals.get(personId);
        if (interval) {
            clearInterval(interval);
            this.intervals.delete(personId);
        }

        const connections = this.connections.get(personId);
        if (connections) {
            connections.forEach(ws => {
                if (ws.readyState === WebSocket.OPEN) {
                    ws.close(1000, 'Stream Stopped');
                }
            });
            this.connections.delete(personId);
        }
    }

    stopAllStreaming(): void {
        for (const personId of this.connections.keys()) {
            this.stopStreaming(personId);
        }
    }

    private handleDisconnection(ws: WebSocket, personId: number): void {
        const connections = this.connections.get(personId);
        if (connections) {
            connections.delete(ws);
            if (connections.size === 0) {
                this.stopStreaming(personId);
            }
        }
    }

    getActiveConnections(): Map<number, number> {
        const activeConnections = new Map<number, number>();
        for (const [personId, connections] of this.connections.entries()) {
            activeConnections.set(personId, connections.size);
        }
        return activeConnections;
    }
}

const wsConnectionManager = new WebSocketManager();
export default wsConnectionManager;