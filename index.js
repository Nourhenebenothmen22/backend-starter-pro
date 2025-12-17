import "dotenv/config";
import express, { urlencoded } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import logger from "./config/logger.js";
import movieRoutes from "./routes/movieRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { connectDB, disconnectDB } from "./config/db.js";

// -----------------------------------
// DATABASE CONNECTION
// -----------------------------------
try {
  await connectDB();
  logger.info("Database connection established");
} catch (error) {
  logger.error("Failed to connect to database", error);
  process.exit(1);
}

// -----------------------------------
// EXPRESS APP INITIALIZATION
// -----------------------------------
const app = express();

// -----------------------------------
// MIDDLEWARES (ORDER MATTERS)
// -----------------------------------
app.use(helmet());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  })
);

// Parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({extended:true}))

// Rate limiting (disabled during tests)
if (process.env.NODE_ENV !== "test") {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use(limiter);
}

// HTTP request logging (use "dev" for debugging)
app.use(morgan("dev"));

// -----------------------------------
// ROUTES
// -----------------------------------

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Movie API Service",
    status: "running",
    version: "1.0.0",
    endpoints: {
      auth: {
        register: "POST /api/v1/auth/register",
        login: "POST /api/v1/auth/login",
      },
      movies: "GET /api/v1/movies",
      health: "GET /health",
    },
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use("/api/v1/users", authRoutes);
app.use("/api/v1/movies", movieRoutes);

// -----------------------------------
// 404 HANDLER (MUST BE LAST)
// -----------------------------------
app.use((req, res) => {
  logger.warn(`404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: "Route not found",
    method: req.method,
    path: req.originalUrl,
    timestamp: new Date().toISOString(),
  });
});

// -----------------------------------
// SERVER STARTUP
// -----------------------------------
const PORT = parseInt(process.env.PORT, 10) || 5000;

const server = app.listen(PORT, () => {
  logger.info("🚀 Server started successfully");
  logger.info(`📊 Environment: ${process.env.NODE_ENV || "development"}`);
  logger.info(`🌐 Server is running at http://localhost:${PORT}`);

});

// -----------------------------------
// GRACEFUL SHUTDOWN
// -----------------------------------
const shutdown = async () => {
  logger.info("Received shutdown signal...");

  try {
    await new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) reject(error);
        else resolve();
      });
    });

    await disconnectDB();
    logger.info("✅ Graceful shutdown completed");
    process.exit(0);
  } catch (error) {
    logger.error("❌ Error during shutdown", error);
    process.exit(1);
  }
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

export default app;
