import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import logger from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { gatewayAuth } from './middleware/gatewayAuth';
import { validateEnv, getEnvNumber } from './config/env';
import gateway from './routes';

validateEnv();

const app = express();
const PORT = getEnvNumber('PORT', 5000);

app.use(express.json());

app.get('/backend/health', (req, res) => {
  res.json({ status: 'ok', service: 'backend' });
});

app.use('/api', gatewayAuth, gateway);

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Backend running on http://localhost:${PORT}`);
});
