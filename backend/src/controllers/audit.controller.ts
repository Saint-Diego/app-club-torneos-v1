import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { AuditLog } from "../models/auditLog.model";

export const getSystemLogs = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    // Paginación estricta para evitar sobrecarga de red en logs masivos
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = (page - 1) * limit;

    const logs = await AuditLog.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await AuditLog.countDocuments();

    res.status(200).json({
      logs,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) },
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Error al obtener los registros de auditoría.";
    res.status(500).json({ message });
  }
};
