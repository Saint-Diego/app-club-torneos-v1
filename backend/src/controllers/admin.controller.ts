import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { Venue } from "../models/venue.model";
import { Team } from "../models/team.model";
import { User } from "../models/user.model";
import bcrypt from "bcryptjs";

export const createVenue = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const venue = new Venue(req.body);
    await venue.save();
    res.status(201).json({ status: "success", venue });
  } catch (error: unknown) {
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Error al crear el venue.",
    });
  }
};

export const createTeam = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const team = new Team(req.body);
    await team.save();
    res.status(201).json({ status: "success", team });
  } catch (error: unknown) {
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Error al crear el team.",
    });
  }
};

export const createUserByAdmin = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      res
        .status(400)
        .json({ message: "El correo electrónico ya se encuentra registrado." });
      return;
    }
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, passwordHash, role });
    res.status(201).json({ status: "success", userId: user._id });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Error al crear el usuario.";
    res.status(500).json({ message });
  }
};
