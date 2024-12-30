import cors from 'cors';

const corsOptions: cors.CorsOptions = {
    origin: [
        'http://localhost:3001', 
        'http://127.0.0.1:3001',
        'http://localhost:3001', 
        'http://127.0.0.1:3001', 
        'http://172.24.240.1:3001'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS', 'HEAD'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept'],
    optionsSuccessStatus: 200
};

export default corsOptions;