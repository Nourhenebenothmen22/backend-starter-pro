import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import logger from "./config/logger.js"; 

// Load environment variables
dotenv.config();

// Create Express application
const app = express();

// -----------------------------
// MIDDLEWARES
// -----------------------------
app.use(helmet()); // HTTP security headers
app.use(cors()); // Cross-origin control
app.use(express.json()); // JSON parser

// Rate limiting (anti brute-force)
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // maximum 100 requests per IP
    message: "Too many requests from this IP, please try again later",
  })
);

// HTTP logger via Morgan + Winston
app.use(
  morgan("combined", {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);

// -----------------------------
// EXAMPLE ROUTES
// -----------------------------
app.get("/", (req, res) => {
  logger.info("GET / called"); // manual log
  res.json({ message: "Hello World!" });
});

// -----------------------------
// GLOBAL ERROR MIDDLEWARE
// -----------------------------
app.use((err, req, res, next) => {
  logger.error(err.message);
  res.status(err.status || 500).json({ message: "Internal Server Error" });
});

// -----------------------------
// SERVER STARTUP
// -----------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});