import { MatchPlayoff } from "../models/match.model";
import { Types } from "mongoose";

export class PlayoffService {
  public static async advanceWinner(
    matchId: string,
    hG: number,
    aG: number,
    hP: number = 0,
    aP: number = 0,
  ): Promise<void> {
    const match = await MatchPlayoff.findById(matchId);
    if (!match) throw new Error("Partido de playoff no encontrado.");

    let winnerId: Types.ObjectId;

    if (hG > aG) {
      winnerId = match.homeTeamId!;
    } else if (aG > hG) {
      winnerId = match.awayTeamId!;
    } else {
      // Definición por penales obligatoria en eliminación directa
      if (hP === aP)
        throw new Error(
          "Debe definirse un ganador por penales en caso de empate.",
        );
      winnerId = hP > aP ? match.homeTeamId! : match.awayTeamId!;
    }

    match.homeGoals = hG;
    match.awayGoals = aG;
    match.homePenalties = hP;
    match.awayPenalties = aP;
    match.winnerTeamId = winnerId;
    match.isPlayed = true;
    await match.save();

    // Si no tiene siguiente partido, es la Final y el torneo concluye
    if (!match.nextMatchCode) return;

    // Buscar el siguiente partido donde debe insertarse el ganador
    const nextMatch = await MatchPlayoff.findOne({
      tournamentId: match.tournamentId,
      matchCode: match.nextMatchCode,
    });

    if (nextMatch) {
      // Si el casillero local está libre, entra ahí. Si no, va como visitante.
      if (!nextMatch.homeTeamId) {
        nextMatch.homeTeamId = winnerId;
      } else if (!nextMatch.awayTeamId) {
        nextMatch.awayTeamId = winnerId;
      }
      await nextMatch.save();
    }
  }
}
