import { Options } from 'http-proxy-middleware';
import { getEnv } from './env';

export const createProxyOptions = (): Options => ({
  target: getEnv('BACKEND_URL', 'http://localhost:5000'),
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/api',
  },
  on: {
    proxyReq: (proxyReq) => {
      proxyReq.setHeader('X-Gateway-Secret', getEnv('GATEWAY_SECRET'));
      proxyReq.setHeader('X-Gateway-Timestamp', Date.now().toString());
    },
    error: (err, req, res) => {
      console.error('Proxy error:', err);
      (res as any).status(502).json({
        success: false,
        message: 'Backend service unavailable',
      });
    },
  },
});
