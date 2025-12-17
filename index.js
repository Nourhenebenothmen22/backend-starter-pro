import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import logger from "./config/logger.js";
import movieRoutes from "./routes/movieRoutes.js";
import { connectDB } from "./config/db.js";

connectDB()

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
    max: 100, // Maximum 100 requests per IP
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
// ROUTES
// -----------------------------
app.get("/", (req, res) => {
  logger.info("GET / called"); // Manual log
  res.json({ message: "Hello World!" });
});

app.use("/api/v1/movies", movieRoutes);

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
const HOST = process.env.HOST || "0.0.0.0";

app.listen(PORT, HOST, () => {
  logger.info(`Server running on http://${HOST}:${PORT}`);
});