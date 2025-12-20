import prisma from "../config/db.js";
import logger from "../config/logger.js";

// ==================== ADD TO WATCHLIST ====================
const addToWatchList = async (req, res) => {
  try {
    const userId = req.user.id;
    const { movieId, status, notes, rating } = req.body;

    if (!movieId) {
      return res.status(400).json({ success: false, message: "movieId is required" });
    }

    // Check if the movie exists
    const movie = await prisma.movie.findUnique({ where: { id: movieId } });
    if (!movie) {
      return res.status(404).json({ success: false, message: "Movie not found" });
    }

    // Check if already in the watchlist
    const existing = await prisma.watchList.findUnique({
      where: { userId_movieId: { userId, movieId } }
    });

    if (existing) {
      return res.status(409).json({ success: false, message: "Movie is already in the watchlist" });
    }

    // Add to watchlist
    const watchItem = await prisma.watchList.create({
      data: {
        userId,
        movieId,
        status: status || "WATCHING",
        notes: notes || null,
        rating: rating || null
      },
    });

    logger.info(`Movie added to watchlist - UserID: ${userId}, MovieID: ${movieId}`);

    res.status(201).json({
      success: true,
      message: "Movie successfully added to watchlist",
      data: watchItem,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    logger.error("Error adding movie to watchlist: %o", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export default { addToWatchList };
