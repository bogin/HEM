import cors from 'cors';

const corsOptions: cors.CorsOptions = {
    origin: 'http://localhost:3001',
    credentials: true,
    methods: ['GET', 'POST']
};

export default corsOptions;