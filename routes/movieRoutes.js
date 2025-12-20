import express from "express";
import movieController from "../controllers/movieController.js";

const router = express.Router();

// Create a movie
router.post("/", movieController.addMovie);

// Get all movies
router.get("/", movieController.findMovies);

// Update a movie by ID
router.put("/:id", movieController.editMovie);

// Delete a movie by ID
router.delete("/:id", movieController.removeMovie);

export default router;
