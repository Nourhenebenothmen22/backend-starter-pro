import express from "express";

const router = express.Router();

// Exemple de route
router.get("/", (req, res) => {
  res.json({ message: "Hello from router!" });
});

// Export du router
export default router;
