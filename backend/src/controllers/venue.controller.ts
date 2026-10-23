import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { Match } from "../models/match.model";
import { BookingService } from "../services/booking.service";

export const scheduleMatchLocation = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { matchId } = req.params;
    const { venueId, courtId, scheduledAt, durationMinutes } = req.body;

    const isAvailable = await BookingService.validateCourtAvailability(
      venueId,
      courtId,
      new Date(scheduledAt),
      durationMinutes,
      matchId,
    );

    if (!isAvailable) {
      res
        .status(400)
        .json({
          message:
            "Conflicto de reserva: La cancha ya se encuentra asignada en ese rango horario.",
        });
      return;
    }

    const match = await Match.findByIdAndUpdate(
      matchId,
      { venueId, courtId, scheduledAt: new Date(scheduledAt), durationMinutes },
      { new: true },
    );

    res
      .status(200)
      .json({
        message: "Partido programado exitosamente sin conflictos.",
        match,
      });
  } catch (error: any) {
    res.status(500).json({
      message: error instanceof Error ? error.message : String(error),
    });
  }
};
