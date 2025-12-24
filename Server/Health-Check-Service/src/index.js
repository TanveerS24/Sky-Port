import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import healthRoutes from "./routes/healthCheck.routes.js";
import { startHealthCheck } from "./middlewares/healthCheck.middleware.js";

const PORT = process.env.PORT || 3002;

app.use("/", healthRoutes);

app.listen(PORT, () => {
    console.log(`Health-Check-Service running on port ${PORT}`);
});

// Future enhancement: API Gateway based trigger
startHealthCheck();
