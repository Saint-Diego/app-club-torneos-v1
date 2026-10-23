import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import path from "path";

const logDirectory = path.join(__dirname, "../../logs");

// Formato personalizado y legible para desarrollo y producción
const customFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }), // Captura automáticamente el Stack Trace del error
  winston.format.splat(),
  winston.format.json(),
);

// Formato de consola a color para desarrollo local
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: "HH:mm:ss" }),
  winston.format.printf(({ timestamp, level, message, stack }) => {
    return `[${timestamp}] ${level}: ${message} ${stack ? `\n${stack}` : ""}`;
  }),
);

export const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: customFormat,
  transports: [
    // 1. Archivo rotativo para errores críticos (Error)
    new DailyRotateFile({
      dirname: path.join(logDirectory, "errors"),
      filename: "error-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "30d", // Retener logs por un mes
      level: "error",
    }),
    // 2. Archivo rotativo para logs generales (Info, Warn, Error)
    new DailyRotateFile({
      dirname: path.join(logDirectory, "combined"),
      filename: "combined-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
    }),
  ],
  // Captura fallos fuera de los bloques Try/Catch (Promesas rechazadas no controladas)
  exceptionHandlers: [
    new DailyRotateFile({
      dirname: path.join(logDirectory, "exceptions"),
      filename: "exceptions-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "30d",
    }),
  ],
});

// Si estamos en desarrollo, imprimir también en la consola con colores descriptivos
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: consoleFormat,
    }),
  );
}
