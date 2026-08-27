import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';
import logger from './config/logger';
import { validateEnv, getEnv, getEnvNumber } from './config/env';
import { createProxyOptions } from './config/proxy';
import { gatewayLimiter, authLimiter } from './middleware/rateLimiter';

validateEnv();

const app = express();
const PORT = getEnvNumber('GATEWAY_PORT', 3000);
const CORS_ORIGIN = getEnv('CORS_ORIGIN', 'http://localhost:5173');

app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true,
}));

app.use(express.json());
app.use(gatewayLimiter);

app.get('/gateway/health', (req, res) => {
  res.json({ status: 'ok', service: 'gateway' });
});

app.use('/api/auth', authLimiter);

app.use('/api', createProxyMiddleware(createProxyOptions()));

app.listen(PORT, () => {
  logger.info(`Gateway running on http://localhost:${PORT}`);
  logger.info(`Proxying to backend: ${getEnv('BACKEND_URL')}`);
});
