import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { PlayoffService } from "../services/playoff.service";

export const submitPlayoffReport = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { homeGoals, awayGoals, homePenalties, awayPenalties } = req.body;

    await PlayoffService.advanceWinner(
      id,
      homeGoals,
      awayGoals,
      homePenalties,
      awayPenalties,
    );

    res
      .status(200)
      .json({
        status: "success",
        message: "Resultado de llave guardado y progresión calculada.",
      });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Error al enviar el informe de la llave.";
    res.status(400).json({ status: "fail", message });
  }
};
