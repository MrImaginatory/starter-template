import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import path from 'path';
import { createProxyMiddleware, RequestHandler } from 'http-proxy-middleware';
import logger from './config/logger';
import { validateEnv, getEnv, getEnvNumber } from './config/env';
import { createProxyOptions } from './config/proxy';
import { gatewayLimiter, authLimiter } from './middleware/rateLimiter';
import logRoutes from './routes/logs';
import statusRoutes from './routes/status';

validateEnv();

const app = express();
const PORT = getEnvNumber('GATEWAY_PORT', 3000);
const CORS_ORIGIN = getEnv('CORS_ORIGIN', 'http://localhost:5173');
const BACKEND_URL = getEnv('BACKEND_URL', 'http://localhost:5000');

app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true,
}));

app.use(express.json());
app.use(gatewayLimiter);

// Serve static files from public folder
app.use(express.static(path.join(__dirname, '../public')));

// Gateway endpoints
app.get('/gateway/health', (req, res) => {
  res.json({ status: 'ok', service: 'gateway' });
});

app.use('/gateway/status', statusRoutes);
app.use('/gateway/logs', logRoutes);

// Backend proxy - all /backend/* requests go to backend
const backendProxy: RequestHandler = createProxyMiddleware({
  target: BACKEND_URL,
  changeOrigin: true,
  pathRewrite: (path) => {
    // Express strips /backend prefix, so path is /status, /logs, etc.
    if (path === '/status') return '/api/v1/status';
    if (path.startsWith('/logs/download')) return '/api/v1/logs/download';
    if (path.startsWith('/logs')) return '/api/v1/logs';
    return `/api/v1${path}`;
  },
  on: {
    proxyReq: (proxyReq) => {
      proxyReq.setHeader('X-Gateway-Secret', getEnv('GATEWAY_SECRET'));
    },
    error: (err, req, res) => {
      logger.error('Backend proxy error', { error: err.message, path: req.url });
      (res as express.Response).status(502).json({ 
        success: false, 
        message: 'Backend service unavailable' 
      });
    },
  },
});

app.use('/backend', backendProxy);

app.use('/api/auth', authLimiter);

app.use('/api', createProxyMiddleware(createProxyOptions()));

app.listen(PORT, () => {
  logger.info(`Gateway running on http://localhost:${PORT}`);
  logger.info(`Proxying to backend: ${BACKEND_URL}`);
});
