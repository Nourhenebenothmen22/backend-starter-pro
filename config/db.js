import pkg from "pg";
const { Pool } = pkg;
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import logger from "./logger.js";

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const connectDB = async () => {
  try {
    await prisma.$connect();
    logger.info("✅ Database connected");
  } catch (err) {
    logger.error("❌ DB connection failed", err);
    process.exit(1);
  }
};
const disconnectDB=async()=>{
  await prisma.$disconnect()
}

export { prisma, connectDB};
