import { Schema, model, Document } from "mongoose";

export interface ISponsor extends Document {
  name: string;
  logoUrl?: string;
  contributionAmount?: number;
  isActive: boolean;
}

const SponsorSchema = new Schema<ISponsor>(
  {
    name: { type: String, required: true, unique: true },
    logoUrl: { type: String },
    contributionAmount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const Sponsor = model<ISponsor>("Sponsor", SponsorSchema);
