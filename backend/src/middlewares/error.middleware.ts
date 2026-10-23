import { Request, Response, NextFunction } from "express";
import { logger } from "../config/logger";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  // Registrar el error con su respectivo Stack Trace contextualizado
  logger.error(
    `Error en Petición - RUTA: ${req.method} ${req.originalUrl} - ESTADO: ${statusCode} - DETALLE: ${message}`,
    err, // Winston mapea automáticamente el objeto de error y extrae el stack trace
  );

  res.status(statusCode).json({
    status: "error",
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
