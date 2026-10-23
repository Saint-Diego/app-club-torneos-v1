import { Schema, model, Document } from "mongoose";

export interface ICourt {
  name: string; // Ejemplo: "Cancha 1 - Césped Natural"
  type: "Fútbol 11" | "Fútbol 7" | "Futsal";
  hasLighting: boolean;
}

export interface IVenue extends Document {
  name: string;
  address: string;
  courts: ICourt[];
  isActive: boolean;
}

const CourtSchema = new Schema<ICourt>({
  name: { type: String, required: true },
  type: {
    type: String,
    enum: ["Fútbol 11", "Fútbol 7", "Futsal"],
    required: true,
  },
  hasLighting: { type: Boolean, default: false },
});

const VenueSchema = new Schema<IVenue>(
  {
    name: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    courts: [CourtSchema],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const Venue = model<IVenue>("Venue", VenueSchema);
