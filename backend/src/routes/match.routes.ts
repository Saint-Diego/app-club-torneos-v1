import { Router } from "express";
import { submitMatchReport } from "../controllers/match.controller";
import { protect, restrictTo } from "../middlewares/auth.middleware";
import { validateBody } from "../middlewares/validate.middleware";
import { MatchReportSchema } from "../schemas/validation.schemas";

const router = Router();

router.post(
  "/:matchId/report",
  protect,
  restrictTo("Admin", "Organizador"),
  validateBody(MatchReportSchema),
  submitMatchReport,
);
export default router;
