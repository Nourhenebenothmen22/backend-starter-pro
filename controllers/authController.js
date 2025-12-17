import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../config/db.js";
import logger from "../config/logger.js";

// ==================== REGISTER ====================
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      logger.warn(
        `Registration attempt with missing fields - Email: ${email || "not provided"}`
      );
      return res.status(400).json({
        success: false,
        message: "Missing required fields: name, email, password",
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      logger.warn(`Invalid email format - Email: ${email}`);
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // Password validation
    if (password.length < 6) {
      logger.warn(`Password too short - Email: ${email}`);
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    // Check if user already exists
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      logger.warn(`User already exists - Email: ${email}`);
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || "USER",
      },
    });

    logger.info(
      `User registered successfully - ID: ${user.id}, Email: ${user.email}`
    );

    // Format response user object
    const formattedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        user: formattedUser,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error("Registration error", {
      email: req.body?.email,
      error: error.stack,
    });

    res.status(500).json({
      success: false,
      message: "User creation failed",
      error:
        process.env.NODE_ENV === "development" ? error.message : undefined,
      timestamp: new Date().toISOString(),
    });
  }
};

// ==================== LOGIN ====================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate credentials
    if (!email || !password) {
      logger.warn(
        `Login attempt with missing credentials - Email: ${email || "not provided"}`
      );
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      logger.warn(`Login attempt with invalid email - Email: ${email}`);
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      logger.warn(
        `Invalid password attempt - Email: ${email}, UserID: ${user.id}`
      );
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        email: user.email,
      },
      process.env.JWT_SECRET || "fallback_secret_change_in_production",
      { expiresIn: process.env.JWT_EXPIRES_IN || "24h" }
    );

    // Format response user object
    const formattedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };

    logger.info(
      `User logged in successfully - ID: ${user.id}, Email: ${user.email}`
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: formattedUser,
        token,
        tokenType: "Bearer",
        expiresIn: process.env.JWT_EXPIRES_IN || "24h",
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error("Login error", {
      email: req.body?.email,
      error: error.stack,
    });

    res.status(500).json({
      success: false,
      message: "Login failed",
      error:
        process.env.NODE_ENV === "development" ? error.message : undefined,
      timestamp: new Date().toISOString(),
    });
  }
};

export { register, login };
