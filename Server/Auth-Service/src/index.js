import dotenv from 'dotenv';

dotenv.config();

import app from './app.js';
import connectDB from './config/db.js';
import routes from './routes/auth.routes.js';

const PORT = process.env.PORT || 3001;

app.use('/', routes)

const server = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Auth Service is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
    }
};

server();
