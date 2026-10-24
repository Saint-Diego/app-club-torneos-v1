import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { Tournament } from "../models/tournament.model";
import { Match } from "../models/match.model";
import { FixtureService } from "../services/fixture.service";
import { Types } from "mongoose";

export const createTournament = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { name, type, teamIds } = req.body; // teamIds: string[]
    const objectTeamIds = teamIds.map((id: string) => new Types.ObjectId(id));

    // Inicializar tabla de posiciones en 0
    const initialStandings = objectTeamIds.map((tId: Types.ObjectId) => ({
      teamId: tId,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalsDifference: 0,
      points: 0,
    }));

    const tournament = new Tournament({
      name,
      type,
      teams: objectTeamIds,
      standings: initialStandings,
    });
    await tournament.save();

    // Generar Fixture Automático mediante Round Robin
    const rounds = FixtureService.generateRoundRobin(objectTeamIds, type);

    for (const round of rounds) {
      for (const matchSlot of round.matches) {
        await Match.create({
          tournamentId: tournament._id,
          round: round.roundNumber,
          homeTeamId: matchSlot.home,
          awayTeamId: matchSlot.away,
          isPlayed: false,
        });
      }
    }

    res
      .status(201)
      .json({ message: "Torneo y Fixture creados con éxito", tournament });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Error al crear el torneo.";
    res.status(500).json({ message });
  }
};

export const getTournamentStandings = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const tournament = await Tournament.findById(id).populate(
      "standings.teamId",
      "name shieldUrl",
    );
    if (!tournament) {
      res.status(404).json({ message: "Torneo no encontrado" });
      return;
    }
    res.status(200).json(tournament.standings);
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Error al obtener las posiciones del torneo.";
    res.status(500).json({ message });
  }
};
