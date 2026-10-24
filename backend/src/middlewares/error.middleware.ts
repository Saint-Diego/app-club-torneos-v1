import type { ErrorRequestHandler } from "express";
import { logger } from "../config/logger";

export const errorHandler: ErrorRequestHandler = (
  err: unknown,
  req,
  res,
  next,
): void => {
  const error = err instanceof Error ? err : new Error("Internal Server Error");
  if (res.headersSent) {
    next(error);
    return;
  }

  const status =
    typeof err === "object" && err !== null && "statusCode" in err
      ? err.statusCode
      : undefined;
  const statusCode =
    typeof status === "number" && status >= 400 && status < 600 ? status : 500;

  // Registrar el error con su respectivo Stack Trace contextualizado
  logger.error(
    `Error en Petición - RUTA: ${req.method} ${req.originalUrl} - ESTADO: ${statusCode} - DETALLE: ${error.message}`,
    error,
  );

  res.status(statusCode).json({
    status: "error",
    message: error.message,
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  });
};
