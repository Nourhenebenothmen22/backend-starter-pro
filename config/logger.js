import winston from "winston";

const { combine, timestamp, printf, colorize, json } = winston.format;

const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  level: process.env.NODE_ENV === "production" ? "info" : "debug",

  transports: [
    new winston.transports.Console({
      format: combine(colorize(), timestamp(), logFormat),
    }),

    // Logs erreurs
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
      format: combine(timestamp(), json()),
    }),

    // Logs globaux
    new winston.transports.File({
      filename: "logs/combined.log",
      format: combine(timestamp(), json()),
    }),
  ],
});

export default logger;
