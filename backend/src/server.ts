import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import WebSocket from 'ws';
import corsOptions from './config/cors';
import personRoutes from './routes/person.routes';
import wsRoutes from './routes/web-socket.routes';
import wsConnectionManager from './managers/web-socket.manager';

const app = express();
const server = createServer(app);

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api', personRoutes);
app.use('/api', wsRoutes);

const wss = new WebSocket.Server({ server });
wss.on('connection', wsConnectionManager.handleWebSocket);

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`HTTP Server running on port ${PORT}`);
    console.log(`WebSocket Server ready at ws://localhost:${PORT}`);
});