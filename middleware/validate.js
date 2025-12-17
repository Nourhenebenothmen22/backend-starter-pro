import { body, validationResult } from "express-validator";

// User registration validation
export const registerValidation = [
  body("name")
    .isLength({ min: 3 })
    .trim()
    .escape()
    .withMessage("Name must be at least 3 characters long"),

  body("email").isEmail().normalizeEmail().withMessage("Invalid email address"),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number")
    .matches(/[\W_]/)
    .withMessage("Password must contain at least one special character"),

  body("role")
    .optional()
    .isIn(["USER", "ADMIN"])
    .withMessage("Role must be either USER or ADMIN"),
];

// User login validation
export const loginValidation = [
  body("email").isEmail().normalizeEmail().withMessage("Invalid email address"),

  body("password").notEmpty().withMessage("Password is required"),
];

// Middleware to check validation results
export const validateResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
