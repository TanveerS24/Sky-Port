import express from 'express';
import cors from 'cors';

const app = express();

// Body parser middleware - must be before routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

export default app;