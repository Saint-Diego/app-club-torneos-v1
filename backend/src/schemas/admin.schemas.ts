import { z } from "zod";

export const CreateVenueSchema = z.object({
  name: z.string().min(3),
  address: z.string().min(5),
  courts: z
    .array(
      z.object({
        name: z.string().min(2),
        type: z.enum(["Fútbol 11", "Fútbol 7", "Futsal"]),
        hasLighting: z.boolean(),
      }),
    )
    .min(1),
});

export const CreateSponsorSchema = z.object({
  name: z.string().min(2),
  logoUrl: z.string().url().optional(),
  contributionAmount: z.number().min(0).optional(),
});

export const CreateTeamSchema = z.object({
  name: z.string().min(3),
  clubId: z.string(),
  category: z.enum(["Sub-17", "Libre", "Veteranos"]),
  shieldUrl: z.string().url().optional(),
});
