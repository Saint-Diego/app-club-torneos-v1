import { Schema, model, Document } from "mongoose";

export interface IClub extends Document {
  name: string;
  logoUrl?: string;
  hqAddress?: string;
  delegateId: Schema.Types.ObjectId;
}

const ClubSchema = new Schema<IClub>(
  {
    name: { type: String, required: true, unique: true },
    logoUrl: { type: String },
    hqAddress: { type: String },
    delegateId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

export const Club = model<IClub>("Club", ClubSchema);
