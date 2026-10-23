import { Match } from "../models/match.model";
import { Types } from "mongoose";

export class BookingService {
  public static async validateCourtAvailability(
    venueId: string,
    courtId: string,
    scheduledAt: Date,
    durationMinutes: number,
    excludeMatchId?: string,
  ): Promise<boolean> {
    const startTime = new Date(scheduledAt);
    const endTime = new Date(
      startTime.getTime() + (durationMinutes + 15) * 60000,
    ); // 15 mins colchón de limpieza/calentamiento

    const query: any = {
      venueId: new Types.ObjectId(venueId),
      courtId: courtId,
      isPlayed: false,
      scheduledAt: { $lt: endTime },
    };

    if (excludeMatchId) {
      query._id = { $ne: new Types.ObjectId(excludeMatchId) };
    }

    const overlappingMatches = await Match.find(query);

    // Validar intersección de intervalos de tiempo
    for (const match of overlappingMatches) {
      const matchStart = new Date(match.scheduledAt);
      const matchEnd = new Date(
        matchStart.getTime() + (match.durationMinutes || 90) * 60000,
      );

      if (startTime < matchEnd && endTime > matchStart) {
        return false; // Existe conflicto de horario
      }
    }

    return true; // Disponible
  }
}
