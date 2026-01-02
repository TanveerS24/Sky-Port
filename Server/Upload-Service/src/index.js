import dotenv from 'dotenv';

dotenv.config();

import connectDB from './config/db.config.js';
import app from './app.js';
import uploadRouter from './routes/upload.routes.js';

const PORT = process.env.PORT || 3003;

app.get('/', (req, res) => {
    res.send('Upload Service is running');
});

app.use('/', uploadRouter);

const server = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Upload Service is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
    }
};

server();
