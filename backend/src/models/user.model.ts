import { Schema, model, Document } from "mongoose";

export type UserRole = "Admin" | "Organizador" | "Delegado" | "Jugador";

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["Admin", "Organizador", "Delegado", "Jugador"],
      default: "Jugador",
      required: true,
    },
  },
  { timestamps: true },
);

export const User = model<IUser>("User", UserSchema);
