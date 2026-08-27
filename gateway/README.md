# Gateway — API Gateway

Express 5 + TypeScript API Gateway with rate limiting, CORS, and request proxying to backend.

---

## Features

- **Express 5** with TypeScript
- **Rate Limiting** — Global (200 req/15min) + Auth (10 req/15min)
- **CORS** — Configurable origin
- **Request Proxy** — Forwards `/api/*` to backend
- **Gateway Authentication** — Adds `X-Gateway-Secret` header
- **Structured Logging** — Winston
- **Health Check** — `/gateway/health` endpoint
- **Environment Validation** — Fails fast on missing config

---

## Quick Start

```bash
cd gateway
pnpm install
cp .env.example .env
# Edit .env if needed
pnpm dev
```

Gateway runs on `http://localhost:3000`

---

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NODE_ENV` | No | `development` | Environment |
| `GATEWAY_PORT` | No | `3000` | Gateway port |
| `BACKEND_URL` | Yes | — | Backend URL (e.g., `http://localhost:5000`) |
| `GATEWAY_SECRET` | Yes | — | Shared secret with backend |
| `CORS_ORIGIN` | No | `http://localhost:5173` | Frontend origin |

---

## Project Structure

```
gateway/
├── src/
│   ├── config/
│   │   ├── env.ts          # Environment validation
│   │   ├── logger.ts       # Winston logger
│   │   └── proxy.ts        # Proxy configuration
│   ├── middleware/
│   │   └── rateLimiter.ts  # Rate limiters
│   └── index.ts            # Entry point
├── package.json
├── tsconfig.json
└── .env.example
```

---

## How It Works

### Request Flow

```
Client → Gateway (port 3000) → Backend (port 5000)
              │                      │
              ├── CORS               ├── Gateway Auth
              ├── Rate Limit         └── Business Logic
              ├── Add X-Gateway-Secret
              └── Proxy /api/*
```

### Headers Added

- `X-Gateway-Secret` — Shared secret for backend validation
- `X-Gateway-Timestamp` — Request timestamp

---

## Rate Limiting

| Limiter | Window | Max Requests | Applied To |
|---------|--------|--------------|------------|
| `gatewayLimiter` | 15 min | 200 | All `/api/*` |
| `authLimiter` | 15 min | 10 | `/api/auth/*` |
| `createCustomLimiter(ms, max)` | Custom | Custom | Custom routes |

```typescript
import { createCustomLimiter } from './middleware/rateLimiter';

// 50 requests per 5 minutes
app.use('/api/heavy', createCustomLimiter(5 * 60 * 1000, 50));
```

---

## CORS

Configured via `CORS_ORIGIN` env var. Supports credentials.

```typescript
// src/index.ts
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true,
}));
```

---

## Proxy Configuration

```typescript
// src/config/proxy.ts
export const createProxyOptions = () => ({
  target: getEnv('BACKEND_URL'),
  changeOrigin: true,
  pathRewrite: { '^/api': '/api' },
  on: {
    proxyReq: (proxyReq) => {
      proxyReq.setHeader('X-Gateway-Secret', getEnv('GATEWAY_SECRET'));
      proxyReq.setHeader('X-Gateway-Timestamp', Date.now().toString());
    },
    error: (err, req, res) => {
      res.status(502).json({ success: false, message: 'Backend unavailable' });
    },
  },
});
```

---

## Health Check

```bash
curl http://localhost:3000/gateway/health
# {"status":"ok","service":"gateway"}
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Watch mode (tsx) |
| `pnpm build` | Compile to `dist/` |
| `pnpm start` | Run compiled JS |

---

## Security

- Validates `BACKEND_URL` and `GATEWAY_SECRET` at startup
- Rate limiting prevents abuse
- CORS restricts origins
- Backend rejects requests without valid gateway secret

---

## Production

```bash
pnpm build
NODE_ENV=production pnpm start
```

Use a process manager (PM2, Docker) for production deployments.