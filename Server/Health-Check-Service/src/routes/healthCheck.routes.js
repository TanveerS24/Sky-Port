import { Router } from "express";
import { checkServicesHealth } from "../controllers/healthCheck.controller.js";

const router = Router();

router.get("/health-check", async (req, res) => {
    await checkServicesHealth();
    res.json({ message: "Health check triggered" });
});

export default router;
