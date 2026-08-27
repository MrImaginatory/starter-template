import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import logger from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { rateLimiter } from './middleware/rateLimiter';
import { validateEnv, getEnvNumber } from './config/env';
import gateway from './routes';

validateEnv();

const app = express();
const PORT = getEnvNumber('PORT', 5000);

app.use(cors());
app.use(express.json());
app.use(rateLimiter);

app.use('/api', gateway);

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
});
