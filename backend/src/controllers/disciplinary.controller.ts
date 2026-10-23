import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { Suspension } from "../models/suspension.model";

export const getActiveSuspensions = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { tournamentId } = req.params;
    const suspensions = await Suspension.find({
      tournamentId,
      isActive: true,
    })
      .populate("playerId", "name dni jerseyNumber")
      .populate("teamId", "name");

    res.status(200).json(suspensions);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
