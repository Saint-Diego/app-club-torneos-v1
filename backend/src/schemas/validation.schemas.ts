import { z } from "zod";

export const RegisterSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["Admin", "Organizador", "Delegado", "Jugador"]),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const MatchReportSchema = z.object({
  homeGoals: z.number().min(0),
  awayGoals: z.number().min(0),
  events: z.object({
    goals: z.array(
      z.object({
        playerId: z.string(),
        minute: z.number().min(1).max(120),
      }),
    ),
    cards: z.array(
      z.object({
        playerId: z.string(),
        type: z.enum(["Yellow", "Red"]),
        minute: z.number().min(1).max(120),
      }),
    ),
  }),
});
