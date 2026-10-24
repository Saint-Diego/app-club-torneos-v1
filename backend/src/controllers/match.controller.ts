import type { Response } from "express";
import { Types } from "mongoose";
import { z } from "zod";
import { AuthRequest } from "../middlewares/auth.middleware";
import { Match } from "../models/match.model";
import { Tournament } from "../models/tournament.model";
import { Player } from "../models/player.model";
import { MatchReportSchema } from "../schemas/validation.schemas";

type MatchReportBody = z.infer<typeof MatchReportSchema>;

export const submitMatchReport = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { matchId } = req.params;
    const { homeGoals, awayGoals, events } = req.body as MatchReportBody;

    const match = await Match.findById(matchId);
    if (!match || match.isPlayed) {
      res
        .status(400)
        .json({
          message: "Encuentro no disponible para edición o ya finalizado.",
        });
      return;
    }

    const homeTeamId = match.homeTeamId;
    const awayTeamId = match.awayTeamId;
    if (!homeTeamId || !awayTeamId) {
      res.status(400).json({
        message: "El encuentro aún no tiene ambos equipos asignados.",
      });
      return;
    }

    const tournament = await Tournament.findById(match.tournamentId);
    if (!tournament) {
      res.status(404).json({ message: "Torneo asociado no encontrado." });
      return;
    }

    // 1. PROCESAR TABLA DE POSICIONES GENERAL
    const updateStanding = (
      teamId: string,
      gf: number,
      gc: number,
      pts: number,
      outcome: "w" | "d" | "l",
    ) => {
      const row = tournament.standings.find(
        (s) => s.teamId.toString() === teamId,
      );
      if (row) {
        row.played += 1;
        row.goalsFor += gf;
        row.goalsAgainst += gc;
        row.goalsDifference = row.goalsFor - row.goalsAgainst;
        row.points += pts;
        if (outcome === "w") row.won += 1;
        if (outcome === "d") row.drawn += 1;
        if (outcome === "l") row.lost += 1;
      }
    };

    const hPts = homeGoals > awayGoals ? 3 : homeGoals === awayGoals ? 1 : 0;
    const aPts = awayGoals > homeGoals ? 3 : homeGoals === awayGoals ? 1 : 0;
    updateStanding(
      homeTeamId.toString(),
      homeGoals,
      awayGoals,
      hPts,
      homeGoals > awayGoals ? "w" : homeGoals === awayGoals ? "d" : "l",
    );
    updateStanding(
      awayTeamId.toString(),
      awayGoals,
      homeGoals,
      aPts,
      awayGoals > homeGoals ? "w" : homeGoals === awayGoals ? "d" : "l",
    );

    // 2. PROCESAR MÓDULO DE GOLEADORES EN TIEMPO REAL
    for (const goal of events.goals) {
      const player = await Player.findById(goal.playerId);
      if (player) {
        const scorerRow = tournament.topScorers.find(
          (s) => s.playerId.toString() === player._id.toString(),
        );
        if (scorerRow) {
          scorerRow.goals += 1;
        } else {
          tournament.topScorers.push({
            playerId: player._id,
            teamId: player.teamId,
            goals: 1,
          });
        }
      }
    }

    // 3. PROCESAR MÓDULO DE VALLA MENOS VENCIDA (Arqueros registrados por equipo)
    // Se asume el cálculo mapeando los goles en contra del equipo al arquero titular asignado
    const registerCleanSheetStats = async (
      teamId: string,
      goalsConceded: number,
    ) => {
      const goalkeeper = await Player.findOne({ teamId, position: "Arquero" });
      if (goalkeeper) {
        const gkRow = tournament.bestGoalkeepers.find(
          (g) => g.playerId.toString() === goalkeeper._id.toString(),
        );
        if (gkRow) {
          gkRow.goalsConceded += goalsConceded;
          gkRow.minutesPlayed += 90; // Duración estándar por partido reglamentario
        } else {
          tournament.bestGoalkeepers.push({
            playerId: goalkeeper._id,
            teamId: goalkeeper.teamId,
            goalsConceded,
            minutesPlayed: 90,
          });
        }
      }
    };

    await registerCleanSheetStats(homeTeamId.toString(), awayGoals);
    await registerCleanSheetStats(awayTeamId.toString(), homeGoals);

    // Ordenaciones lógicas analíticas
    tournament.standings.sort(
      (a, b) => b.points - a.points || b.goalsDifference - a.goalsDifference,
    );
    tournament.topScorers.sort((a, b) => b.goals - a.goals);
    tournament.bestGoalkeepers.sort(
      (a, b) => a.goalsConceded - b.goalsConceded,
    );

    match.homeGoals = homeGoals;
    match.awayGoals = awayGoals;
    match.events = {
      goals: events.goals.map((goal) => ({
        ...goal,
        playerId: new Types.ObjectId(goal.playerId),
      })),
      cards: events.cards.map((card) => ({
        ...card,
        playerId: new Types.ObjectId(card.playerId),
      })),
    };
    match.isPlayed = true;
    await match.save();
    await tournament.save();
    res
      .status(200)
      .json({
        message: "Módulos analíticos de torneos calculados y consolidados.",
        tournament,
      });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Error procesando el acta del partido.";
    res.status(500).json({ message });
  }
};
