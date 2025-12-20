import prisma from "../config/db.js";
import logger from "../config/logger.js";

// ==================== CREATE MOVIE ====================
const addMovie = async (req, res) => {
  try {
    const { title, overview, releaseDate, posterPath, rating, genres, userId } = req.body;

    if (!title || !overview || !releaseDate || !userId) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const movie = await prisma.movie.create({
      data: {
        title,
        overview,
        releaseDate: new Date(releaseDate),
        posterPath,
        rating: rating || 0,
        genres,
        userId,
      },
    });

    logger.info(`Movie created: ${movie.title} (ID: ${movie.id})`);
    res.status(201).json({ success: true, data: movie });
  } catch (error) {
    logger.error("Error creating movie", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ==================== READ MOVIES ====================
const findMovies = async (req, res) => {
  try {
    const movies = await prisma.movie.findMany({
      include: {
        user: true,
        watchList: true,
      },
    });
    res.status(200).json({ success: true, data: movies });
  } catch (error) {
    logger.error("Error fetching movies", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ==================== UPDATE MOVIE ====================
const editMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, overview, releaseDate, posterPath, rating, genres } = req.body;

    const movie = await prisma.movie.update({
      where: { id: Number(id) },
      data: {
        title,
        overview,
        releaseDate: releaseDate ? new Date(releaseDate) : undefined,
        posterPath,
        rating,
        genres,
      },
    });

    logger.info(`Movie updated: ${movie.title} (ID: ${movie.id})`);
    res.status(200).json({ success: true, data: movie });
  } catch (error) {
    logger.error("Error updating movie", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ==================== DELETE MOVIE ====================
const removeMovie = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.movie.delete({
      where: { id: Number(id) },
    });

    logger.info(`Movie deleted (ID: ${id})`);
    res.status(200).json({ success: true, message: "Movie deleted successfully" });
  } catch (error) {
    logger.error("Error deleting movie", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export default { addMovie, findMovies, editMovie, removeMovie };
