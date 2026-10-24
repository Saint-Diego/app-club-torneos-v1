import { Router } from "express";
import { Tournament } from "../models/tournament.model";
import { ExportService } from "../services/export.service";
import {
  createTournament,
  getTournamentStandings,
} from "../controllers/tournament.controller";
import { protect, restrictTo } from "../middlewares/auth.middleware";

const router = Router();
router.post("/", protect, restrictTo("Admin", "Organizador"), createTournament);
router.get("/:id/standings", getTournamentStandings);
router.get("/:id/export/pdf", async (req, res): Promise<void> => {
  try {
    const tournament = await Tournament.findById(req.params.id).populate(
      "standings.teamId",
    );
    if (!tournament) {
      res.status(404).json({ message: "Torneo inoperable" });
      return;
    }

    const pdfBuffer = await ExportService.generateStandingsPDF(tournament);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=posiciones-${req.params.id}.pdf`,
    );
    res.send(pdfBuffer);
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : "Error al generar el PDF de posiciones.";
    res.status(500).json({ message });
  }
});

router.get("/:id/export/excel", async (req, res): Promise<void> => {
  try {
    const tournament = await Tournament.findById(req.params.id).populate(
      "standings.teamId",
    );
    if (!tournament) {
      res.status(404).json({ message: "Torneo inoperable" });
      return;
    }

    const excelBuffer = await ExportService.generateAnalyticsExcel(tournament);
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=analitica-${req.params.id}.xlsx`,
    );
    res.send(excelBuffer);
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : "Error al generar el archivo de análisis en excel.";
    res.status(500).json({ message });
  }
});
export default router;
