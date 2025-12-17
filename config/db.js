// config/db.js - Corrected Version
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import logger from './logger.js';

// 1. Create the PostgreSQL pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// 2. Create the adapter
const adapter = new PrismaPg(pool);

// 3. Create the Prisma client with the adapter
const prisma = new PrismaClient({ adapter });

export const connectDB = async () => {
  try {
    // Check the connection
    await prisma.$queryRaw`SELECT 1`;
    logger.info('✅ Database connected successfully');
  } catch (error) {
    logger.error('❌ Failed to connect to the database:', error);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  try {
    await prisma.$disconnect();
    logger.info('✅ Database disconnected successfully');
  } catch (error) {
    logger.error('❌ Error disconnecting from the database:', error);
  }
};

export default prisma;
