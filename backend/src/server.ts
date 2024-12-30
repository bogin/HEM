import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import personRoutes from './routes/person.routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api', personRoutes);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});