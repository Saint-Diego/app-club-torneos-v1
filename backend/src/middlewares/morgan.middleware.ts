import morgan, { StreamOptions } from "morgan";
import { logger } from "../config/logger";

// Enlazar el flujo de salida de Morgan a nuestro Logger Winston
const stream: StreamOptions = {
  write: (message) => logger.info(message.trim()),
};

// Solo registrar peticiones HTTP en consola en entornos de desarrollo, pero siempre en producción
const skip = () => {
  const env = process.env.NODE_ENV || "development";
  return env !== "development" && env !== "production";
};

export const morganMiddleware = morgan(
  ":remote-addr - :method :url :status :res[content-length] - :response-time ms",
  { stream, skip },
);
