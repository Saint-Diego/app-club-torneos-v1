import { Schema, model, Document } from "mongoose";

export interface ITeam extends Document {
  name: string;
  clubId: Schema.Types.ObjectId;
  category: "Sub-17" | "Libre" | "Veteranos";
  shieldUrl?: string;
}

const TeamSchema = new Schema<ITeam>(
  {
    name: { type: String, required: true },
    clubId: { type: Schema.Types.ObjectId, ref: "Club", required: true },
    category: {
      type: String,
      enum: ["Sub-17", "Libre", "Veteranos"],
      required: true,
    },
    shieldUrl: { type: String },
  },
  { timestamps: true },
);

export const Team = model<ITeam>("Team", TeamSchema);
