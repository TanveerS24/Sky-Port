import dotenv from 'dotenv';

dotenv.config();

import app from './app.js';
import connectDB from './config/db.js';

const PORT = process.env.PORT || 3001;

app.get('/', (req, res) => {
  res.json({
    service: "User Service",
    baseUrl: process.env.BASE_URL,
    status: "running"
  });
});

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
