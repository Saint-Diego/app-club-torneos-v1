import { Router } from "express";
import { getSystemLogs } from "../controllers/audit.controller";
import { protect, restrictTo } from "../middlewares/auth.middleware";

const router = Router();
// Exclusivo para administradores del sistema global
router.get("/", protect, restrictTo("Admin"), getSystemLogs);
export default router;
