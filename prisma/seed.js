import "dotenv/config";
import logger from "../config/logger.js";
import prisma from "../config/db.js";

const usersMovies = [
  {
    userId: 2,
    movies: [
      {
        title: "Inception",
        overview: "A mind-bending sci-fi thriller",
        releaseDate: new Date("2010-07-16"),
        posterPath: "/inception.jpg",
        rating: 8.8,
        genres: ["Sci-Fi", "Action"],
      },
      {
        title: "Interstellar",
        overview: "Exploration of space and time",
        releaseDate: new Date("2014-11-07"),
        posterPath: "/interstellar.jpg",
        rating: 8.6,
        genres: ["Sci-Fi", "Drama"],
      },
    ],
  },
  {
    userId: 3,
    movies: [
      {
        title: "The Matrix",
        overview: "Virtual reality and AI",
        releaseDate: new Date("1999-03-31"),
        posterPath: "/matrix.jpg",
        rating: 8.7,
        genres: ["Sci-Fi", "Action"],
      },
      {
        title: "Avatar",
        overview: "A journey to Pandora",
        releaseDate: new Date("2009-12-18"),
        posterPath: "/avatar.jpg",
        rating: 7.9,
        genres: ["Fantasy", "Sci-Fi"],
      },
    ],
  },
  {
    userId: 4,
    movies: [
      {
        title: "Fight Club",
        overview: "An underground fight club",
        releaseDate: new Date("1999-10-15"),
        posterPath: "/fightclub.jpg",
        rating: 8.8,
        genres: ["Drama", "Thriller"],
      }
    ]
  },
  {
    userId: 5,
    movies: [
      {
        title: "Titanic",
        overview: "Romance on the Titanic ship",
        releaseDate: new Date("1997-12-19"),
        posterPath: "/titanic.jpg",
        rating: 7.8,
        genres: ["Romance", "Drama"],
      }
    ]
  },
  {
    userId: 6,
    movies: [
      {
        title: "Gladiator",
        overview: "A Roman general becomes a gladiator",
        releaseDate: new Date("2000-05-05"),
        posterPath: "/gladiator.jpg",
        rating: 8.5,
        genres: ["Action", "Drama"],
      }
    ]
  },
  {
    userId: 7,
    movies: [
      {
        title: "The Lord of the Rings: The Fellowship of the Ring",
        overview: "A quest to destroy the One Ring",
        releaseDate: new Date("2001-12-19"),
        posterPath: "/lotr1.jpg",
        rating: 8.8,
        genres: ["Fantasy", "Adventure"],
      }
    ]
  }
];

async function main() {
  logger.info("🌱 Starting movie seeding process...");

  for (const entry of usersMovies) {
    const { userId, movies } = entry;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      logger.warn(`⚠️ User with ID ${userId} not found, skipping...`);
      continue;
    }

    logger.info(`👤 Seeding movies for user: ${user.email}`);

    await prisma.movie.createMany({
      data: movies.map((movie) => ({
        ...movie,
        userId,
      })),
    });

    logger.info(`🎬 Movies created for user ID ${userId}`);
  }
}

main()
  .then(() => logger.info("🌱 Database seeding completed successfully"))
  .catch((error) => {
    logger.error("❌ Error during database seeding", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    logger.info("🔌 Prisma disconnected");
  });
