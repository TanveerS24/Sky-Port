import { Router } from "express";
import checkServicesHealth from "../controllers/healthCheck.controller.js";

const router = Router();

router.get("/health-check", checkServicesHealth);

export default router;
