import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import logger from '../utils/logger';
import { getEnv } from './env';

const log = logger.child({ module: 'Database' });

let prisma: PrismaClient;

export const connectDB = async (): Promise<PrismaClient> => {
  try {
    const dbProvider = process.env.DB_PROVIDER || 'postgresql';
    const databaseUrl = getEnv('DATABASE_URL');

    if (dbProvider === 'mysql') {
      throw new Error('MySQL is not yet supported in Prisma 8. Use PostgreSQL.');
    }

    const adapter = new PrismaPg({ connectionString: databaseUrl });
    prisma = new PrismaClient({ adapter });

    await prisma.$connect();
    
    // Actually validate the connection with a real query
    await prisma.$queryRaw`SELECT 1 as status`;
    
    log.info(`Database connected successfully (${dbProvider})`);
    return prisma;
  } catch (error) {
    log.error('Database connection failed', { error });
    throw error;
  }
};

export const disconnectDB = async (): Promise<void> => {
  if (prisma) {
    await prisma.$disconnect();
    log.info('Database disconnected');
  }
};

export const getDB = (): PrismaClient => {
  if (!prisma) {
    throw new Error('Database not connected. Call connectDB() first.');
  }
  return prisma;
};

export { PrismaClient };
