import { Schema, model, Document } from "mongoose";

export interface ISuspension extends Document {
  tournamentId: Schema.Types.ObjectId;
  playerId: Schema.Types.ObjectId;
  teamId: Schema.Types.ObjectId;
  reason:
    | "Acumulación de Amarillas"
    | "Tarjeta Roja Directa"
    | "Sanción Tribunal";
  matchesSuspended: number; // Cantidad de jornadas de sanción
  matchesServed: number; // Jornadas ya cumplidas
  isActive: boolean; // Bloquea la inclusión en actas si es true
  createdAt: Date;
}

const SuspensionSchema = new Schema<ISuspension>(
  {
    tournamentId: {
      type: Schema.Types.ObjectId,
      ref: "Tournament",
      required: true,
    },
    playerId: {
      type: Schema.Types.ObjectId,
      ref: "Player",
      required: true,
      index: true,
    },
    teamId: { type: Schema.Types.ObjectId, ref: "Team", required: true },
    reason: {
      type: String,
      enum: [
        "Acumulación de Amarillas",
        "Tarjeta Roja Directa",
        "Sanción Tribunal",
      ],
      required: true,
    },
    matchesSuspended: { type: Number, required: true, default: 1 },
    matchesServed: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const Suspension = model<ISuspension>("Suspension", SuspensionSchema);
