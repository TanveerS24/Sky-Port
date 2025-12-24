import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import router from './routes/proxy.route.js';

import healthCheckLoop from './middlewares/healthCheck.middleware.js';

const app = express();
app.use('/api', router);

// 👇 THIS MUST BE BEFORE ROUTES
app.use(express.json());

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));


const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`API Gateway is running on port ${PORT}`);
    healthCheckLoop();
});
