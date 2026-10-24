import { Suspension } from "../models/suspension.model";
import { Match } from "../models/match.model";
import { Player } from "../models/player.model";
import { Types } from "mongoose";

export class DisciplinaryService {
  private static AMARILLAS_LIMITE = 5;

  public static async processMatchCards(
    tournamentId: string,
    matchId: string,
    cards: Array<{ playerId: string; type: "Yellow" | "Red"; minute: number }>,
  ): Promise<void> {
    const tId = new Types.ObjectId(tournamentId);
    const mId = new Types.ObjectId(matchId);

    // Obtener los datos del partido para mapear el equipo del jugador
    const match = await Match.findById(mId);
    if (!match) return;
    if (!match.homeTeamId || !match.awayTeamId) {
      throw new Error("El partido debe tener ambos equipos asignados.");
    }

    for (const cardEvent of cards) {
      const pId = new Types.ObjectId(cardEvent.playerId);
      const player = await Player.findById(pId);
      if (!player) {
        throw new Error(`No se encontró al jugador ${cardEvent.playerId}.`);
      }

      // Identificar a qué equipo pertenece el jugador en este encuentro
      const playerTeamId = player.teamId.toString();
      const isParticipant =
        playerTeamId === match.homeTeamId.toString() ||
        playerTeamId === match.awayTeamId.toString();
      if (!isParticipant) {
        throw new Error(
          `El jugador ${cardEvent.playerId} no pertenece a los equipos del partido.`,
        );
      }
      const teamId = player.teamId;

      if (cardEvent.type === "Red") {
        // 1. EXPULSIÓN DIRECTA: Suspensión automática inmediata para la siguiente fecha
        await Suspension.create({
          tournamentId: tId,
          playerId: pId,
          teamId,
          reason: "Tarjeta Roja Directa",
          matchesSuspended: 1,
          isActive: true,
        });
      } else if (cardEvent.type === "Yellow") {
        // 2. ACUMULACIÓN DE AMARILLAS: Contar cuántas lleva en el torneo actual
        const previousMatches = await Match.find({
          tournamentId: tId,
          isPlayed: true,
          "events.cards": { $elemMatch: { playerId: pId, type: "Yellow" } },
        });

        // Sumamos 1 por la tarjeta del partido actual
        const totalYellows = previousMatches.length + 1;

        if (totalYellows % this.AMARILLAS_LIMITE === 0) {
          await Suspension.create({
            tournamentId: tId,
            playerId: pId,
            teamId,
            reason: "Acumulación de Amarillas",
            matchesSuspended: 1,
            isActive: true,
          });
        }
      }
    }
  }

  /**
   * Pasa la fecha y descuenta las jornadas cumplidas de los jugadores suspendidos
   */
  public static async updateServedRounds(
    tournamentId: string,
    roundNumber: number,
  ): Promise<void> {
    if (!Number.isInteger(roundNumber) || roundNumber < 1) {
      throw new Error("El número de jornada debe ser un entero positivo.");
    }

    // Al finalizar una jornada, buscamos las suspensiones activas y sumamos una fecha cumplida
    const activeSuspensions = await Suspension.find({
      tournamentId: new Types.ObjectId(tournamentId),
      isActive: true,
    });

    for (const suspension of activeSuspensions) {
      suspension.matchesServed += 1;
      if (suspension.matchesServed >= suspension.matchesSuspended) {
        suspension.isActive = false; // El jugador cumple su sanción y queda habilitado
      }
      await suspension.save();
    }
  }
}
