import { Schema, model, Document } from "mongoose";

export interface IGoalEvent {
  playerId: Schema.Types.ObjectId;
  minute: number;
}

export interface ICardEvent {
  playerId: Schema.Types.ObjectId;
  type: "Yellow" | "Red";
  minute: number;
}

// Interfaz Maestra Unificada para cualquier tipo de partido (Regular o Playoff)
export interface IMatch extends Document {
  tournamentId: Schema.Types.ObjectId;
  isPlayoff: boolean; // Flag discriminador para lógica de negocio

  // Gestión de Jornadas / Llaves
  round?: number; // Obligatorio solo si isPlayoff es false
  phase?: "Cuartos" | "Semifinal" | "Final"; // Obligatorio solo si isPlayoff es true
  matchCode?: string; // Ej: 'C1', 'C2', 'S1', 'F1'
  nextMatchCode?: string | null; // Destino de progresión del ganador

  // Equipos participantes (Pueden ser null en llaves de playoff antes de definirse los clasificados)
  homeTeamId: Schema.Types.ObjectId | null;
  awayTeamId: Schema.Types.ObjectId | null;

  // Resultados y Estado del Encuentro
  homeGoals: number;
  awayGoals: number;
  homePenalties?: number; // Definición por penales obligatoria en empates de Playoff
  awayPenalties?: number;
  winnerTeamId?: Schema.Types.ObjectId | null;
  isPlayed: boolean;

  // Eventos de Acta Digital
  events: {
    goals: IGoalEvent[];
    cards: ICardEvent[];
  };

  // Agenda y Asignación Física de Espacios (Módulo de Sedes)
  venueId?: Schema.Types.ObjectId | null;
  courtId?: string | null;
  scheduledAt?: Date | null;
  durationMinutes?: number;
}

const MatchSchema = new Schema<IMatch>(
  {
    tournamentId: {
      type: Schema.Types.ObjectId,
      ref: "Tournament",
      required: true,
    },
    isPlayoff: { type: Boolean, required: true, default: false },

    // Campos de Fase Regular
    round: { type: Number, default: null },

    // Campos de Fase Eliminatoria (Playoffs)
    phase: {
      type: String,
      enum: ["Cuartos", "Semifinal", "Final"],
      default: null,
    },
    matchCode: { type: String, default: null },
    nextMatchCode: { type: String, default: null },

    // Identificadores de Equipos y Resultados
    homeTeamId: { type: Schema.Types.ObjectId, ref: "Team", default: null },
    awayTeamId: { type: Schema.Types.ObjectId, ref: "Team", default: null },
    homeGoals: { type: Number, default: 0 },
    awayGoals: { type: Number, default: 0 },
    homePenalties: { type: Number, default: 0 },
    awayPenalties: { type: Number, default: 0 },
    winnerTeamId: { type: Schema.Types.ObjectId, ref: "Team", default: null },
    isPlayed: { type: Boolean, default: false },

    // Estructura Atómica de Eventos en Acta
    events: {
      goals: [
        {
          playerId: { type: Schema.Types.ObjectId, ref: "Player" },
          minute: { type: Number },
        },
      ],
      cards: [
        {
          playerId: { type: Schema.Types.ObjectId, ref: "Player" },
          type: { type: String, enum: ["Yellow", "Red"] },
          minute: { type: Number },
        },
      ],
    },

    // Propiedades de Planificación Física de Sedes y Canchas
    venueId: { type: Schema.Types.ObjectId, ref: "Venue", default: null },
    courtId: { type: String, default: null },
    scheduledAt: { type: Date, default: null },
    durationMinutes: { type: Number, default: 90 },
  },
  { timestamps: true },
);

// Índices optimizados para consultas del sistema y chequeo anti-superposición horaria
MatchSchema.index({ tournamentId: 1, isPlayoff: 1 });
MatchSchema.index({ venueId: 1, courtId: 1, scheduledAt: 1 });

export const Match = model<IMatch>("Match", MatchSchema);
