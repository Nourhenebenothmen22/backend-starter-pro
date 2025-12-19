import express from "express";
import { registerValidation, loginValidation, validateResult } from "../middleware/validate.js";
import { register, login,logout } from "../controllers/authController.js";

const router = express.Router();

// Route d'inscription avec validation
router.post("/register", registerValidation, validateResult, register);

// Route de connexion avec validation
router.post("/login", loginValidation, validateResult, login);
router.post("/logout", loginValidation, validateResult, logout);


export default router;