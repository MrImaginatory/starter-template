import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import logger from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { gatewayAuth } from './middleware/gatewayAuth';
import { requestTimeout } from './middleware/timeout';
import { validateEnv, getEnvNumber } from './config/env';
import { connectDB, disconnectDB } from './config/database';
import gateway from './routes';

const startServer = async (): Promise<void> => {
  validateEnv();
  await connectDB();

  const app = express();
  const PORT = getEnvNumber('PORT', 5000);

  app.use(express.json());
  app.use(requestTimeout);

  app.get('/backend/health', (req, res) => {
    res.json({ status: 'ok', service: 'backend' });
  });

  app.use('/api', gatewayAuth, gateway);

  app.use(errorHandler);

  const server = app.listen(PORT, () => {
    logger.info(`Backend running on http://localhost:${PORT}`);
  });

  const shutdown = async (): Promise<void> => {
    logger.info('Shutting down...');
    server.close();
    await disconnectDB();
    process.exit(0);
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
};

startServer().catch((error) => {
  logger.error('Failed to start server', { error });
  process.exit(1);
});
