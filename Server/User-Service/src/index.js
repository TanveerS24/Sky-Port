import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import connectDB from './config/db.js';

import userRoutes from './routes/user.routes.js';

app.use('/', userRoutes);

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`User Service is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
    }

};

startServer();