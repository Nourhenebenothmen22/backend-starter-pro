import winston from "winston";

const { combine, timestamp, printf, colorize, json } = winston.format;

const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format:
    process.env.NODE_ENV === "production"
      ? combine(timestamp(), json())
      : combine(colorize(), timestamp(), logFormat),

  transports: [
    new winston.transports.Console(),

    // Logs erreurs
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    }),

    // Logs globaux
    new winston.transports.File({
      filename: "logs/combined.log",
    }),
  ],
});

export default logger;
