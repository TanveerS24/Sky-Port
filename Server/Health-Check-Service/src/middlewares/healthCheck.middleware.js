import { checkServicesHealth } from "../controllers/healthCheck.controller.js";

export const startHealthCheck = () => {
    setInterval(async () => {
        await checkServicesHealth();
    }, 30 * 1000); // 30 seconds
};
