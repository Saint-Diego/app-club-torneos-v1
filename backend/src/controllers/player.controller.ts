import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { Match } from "../models/match.model";
import { Player } from "../models/player.model";
import { Suspension } from "../models/suspension.model";
import { ITeam } from "../models/team.model";
import { Types } from "mongoose";

export const getPlayerProfile = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { playerId } = req.params;
    const pId = new Types.ObjectId(playerId);

    const player = await Player.findById(pId)
      .populate("userId", "name email")
      .populate<{ teamId: ITeam }>("teamId", "name shieldUrl");

    if (!player) {
      res.status(404).json({ message: "Jugador no encontrado." });
      return;
    }

    // Pipeline de Agregación para compilar goles y tarjetas en la colección de Matches
    const statsAggregation = await Match.aggregate([
      { $match: { isPlayed: true } },
      {
        $facet: {
          goalsCount: [
            { $unwind: "$events.goals" },
            { $match: { "events.goals.playerId": pId } },
            { $count: "total" },
          ],
          yellowCards: [
            { $unwind: "$events.cards" },
            {
              $match: {
                "events.cards.playerId": pId,
                "events.cards.type": "Yellow",
              },
            },
            { $count: "total" },
          ],
          redCards: [
            { $unwind: "$events.cards" },
            {
              $match: {
                "events.cards.playerId": pId,
                "events.cards.type": "Red",
              },
            },
            { $count: "total" },
          ],
          matchesPlayed: [
            {
              $match: {
                $or: [
                  { homeTeamId: player.teamId._id },
                  { awayTeamId: player.teamId._id },
                ],
              },
            },
            { $count: "total" },
          ],
        },
      },
    ]);

    const facet = statsAggregation[0];
    const PJ = facet.matchesPlayed[0]?.total || 0;
    const goles = facet.goalsCount[0]?.total || 0;
    const amarillas = facet.yellowCards[0]?.total || 0;
    const rojas = facet.redCards[0]?.total || 0;

    // Verificar si registra suspensiones activas en el Tribunal
    const activeSuspension = await Suspension.findOne({
      playerId: pId,
      isActive: true,
    });

    res.status(200).json({
      player,
      metrics: {
        matchesPlayed: PJ,
        goals: goles,
        yellowCards: amarillas,
        redCards: rojas,
        minutesPlayed: PJ * 90, // Minutos estimados bajo titularidad estándar
      },
      status: {
        isEligible: !activeSuspension,
        suspensionReason: activeSuspension ? activeSuspension.reason : null,
      },
    });
  } catch (error: unknown) {
    res
      .status(500)
      .json({
        message:
          (error as Error).message || "Error al obtener el perfil del jugador.",
      });
  }
};
