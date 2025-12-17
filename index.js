import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import logger from "./config/logger.js";
import movieRoutes from "./routes/movieRoutes.js";
import { connectDB, disconnectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

// Connect to database with error handling
try {
  await connectDB();
  logger.info("Database connection established");
} catch (error) {
  logger.error("Failed to connect to database:", error);
  process.exit(1);
}

// Create Express application
const app = express();

// -----------------------------
// MIDDLEWARES
// -----------------------------
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || "*",
  credentials: true,
}));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// HTTP logging
app.use(morgan("combined", {
  stream: { write: (message) => logger.info(message.trim()) },
}));

// -----------------------------
// ROUTES
// -----------------------------
app.get("/", (req, res) => {
  res.json({ 
    message: "Movie API Service", 
    version: "1.0.0",
    documentation: "/api-docs",
    health: "/health"
  });
});

app.use("/api/v1/movies", movieRoutes);
app.use("/api/v1/auth", authRoutes);


// -----------------------------
// SERVER INITIALIZATION
// -----------------------------
const PORT = parseInt(process.env.PORT) || 3000;
const HOST = process.env.HOST || "0.0.0.0";

const server = app.listen(PORT, HOST, () => {
  logger.info(`Server started successfully`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`Listening on: http://${HOST}:${PORT}`);
});

// Graceful shutdown handler
const shutdown = async () => {
  logger.info("Initiating graceful shutdown...");
  
  try {
    // Close HTTP server
    await new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) reject(error);
        else resolve();
      });
    });
    logger.info("HTTP server closed");
    
    // Close database connection
    await disconnectDB();
    logger.info("Database connection closed");
    
    logger.info("Shutdown completed successfully");
    process.exit(0);
  } catch (error) {
    logger.error("Error during shutdown:", error);
    process.exit(1);
  }
};

// Register signal handlers
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

export default app;