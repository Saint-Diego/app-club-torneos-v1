import { Schema, model, Document } from "mongoose";

export interface IPlayer extends Document {
  userId?: Schema.Types.ObjectId;
  teamId: Schema.Types.ObjectId;
  dni: string;
  jerseyNumber: number;
  position: string;
}

const PlayerSchema = new Schema<IPlayer>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    teamId: { type: Schema.Types.ObjectId, ref: "Team", required: true },
    dni: { type: String, required: true, unique: true },
    jerseyNumber: { type: Number, required: true },
    position: { type: String, required: true },
  },
  { timestamps: true },
);

export const Player = model<IPlayer>("Player", PlayerSchema);
