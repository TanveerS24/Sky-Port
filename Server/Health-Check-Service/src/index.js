import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import healthRoutes from "./routes/healthCheck.routes.js";

const PORT = process.env.PORT || 3002;

app.use("/", healthRoutes);

app.listen(PORT, () => {
    console.log(`Health-Check-Service running on port ${PORT}`);
});

