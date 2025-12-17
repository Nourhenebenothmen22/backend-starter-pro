import express from "express";
import { registerValidation, loginValidation, validateResult } from "../middleware/validate.js";
import { authController } from "../controllers/authController.js";

const router = express.Router();

// Route d'inscription
router.post("/register", registerValidation, validateResult, authController.register);

// Route de connexion
router.post("/login", loginValidation, validateResult, authController.login);

export default router;
