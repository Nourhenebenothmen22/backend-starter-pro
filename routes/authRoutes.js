import express from "express";
import { registerValidation, loginValidation, validateResult } from "../middleware/validate.js";
import { register,login } from "../controllers/authController.js";

const router = express.Router();

// Route d'inscription
router.post("/register", registerValidation, validateResult,register);

// Route de connexion
router.post("/login", loginValidation, validateResult,login);

export default router;
