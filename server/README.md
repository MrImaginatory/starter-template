# Server — Backend API

Express 5 + TypeScript + Prisma ORM backend with production-ready infrastructure.

---

## Features

- **Express 5** with TypeScript (strict mode)
- **Prisma ORM** — Type-safe database access (PostgreSQL/MySQL)
- **Global Error Handler** — Centralized error handling with custom error classes
- **Request Timeout** — 30s timeout prevents hanging connections
- **Gateway Authentication** — Validates `X-Gateway-Secret` header
- **Structured Logging** — Winston with dev/prod formats
- **Standardized Responses** — Consistent API response format
- **Environment Validation** — Fails fast on missing/invalid config
- **Health Checks** — `/backend/health` endpoint

---

## Quick Start

```bash
cd server
pnpm install
cp .env.example .env
# Edit .env with your database credentials
pnpm exec prisma generate
pnpm dev
```

Server runs on `http://localhost:5000`

---

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NODE_ENV` | No | `development` | `development` \| `production` \| `test` |
| `PORT` | No | `5000` | Server port |
| `LOG_LEVEL` | No | `info` | `error` \| `warn` \| `info` \| `debug` |
| `DB_PROVIDER` | Yes | — | `postgresql` \| `mysql` |
| `DATABASE_URL` | Yes | — | Database connection string |
| `JWT_SECRET` | Yes | — | JWT signing secret |
| `REDIS_URL` | No | `redis://localhost:6379` | Redis connection |
| `GATEWAY_SECRET` | Yes | — | Shared secret with gateway |

---

## Project Structure

```
server/
├── prisma/
│   ├── schema.prisma           # PostgreSQL schema
│   └── schema.mysql.prisma     # MySQL schema
├── src/
│   ├── config/
│   │   ├── env.ts              # Environment validation
│   │   └── database.ts         # Prisma connection
│   ├── middleware/
│   │   ├── errorHandler.ts     # Global error handler
│   │   ├── gatewayAuth.ts      # Gateway secret validation
│   │   ├── rateLimiter.ts      # Rate limiting (legacy)
│   │   └── timeout.ts          # Request/response timeout
│   ├── routes/
│   │   ├── v1/
│   │   │   ├── health.ts       # Health check
│   │   │   └── index.ts        # V1 route aggregator
│   │   └── index.ts            # Gateway (versioning)
│   ├── utils/
│   │   ├── logger.ts           # Winston logger
│   │   ├── response.ts         # sendSuccess/sendError/sendPaginated
│   │   ├── messages.ts         # Centralized messages
│   │   ├── errors.ts           # Custom error classes
│   │   ├── validators.ts       # Validation helpers
│   │   ├── formatters.ts       # Formatting helpers
│   │   ├── helpers.ts          # Common utilities
│   │   └── index.ts            # Barrel export
│   └── index.ts                # Entry point
├── package.json
├── tsconfig.json
└── .env.example
```

---

## API Endpoints

### Health

```
GET /backend/health          # Direct backend health (no auth)
GET /api/v1/health           # Via gateway (requires auth)
```

---

## Adding Routes

```typescript
// src/routes/v1/users.ts
import { Router } from 'express';
import { asyncHandler } from '../../middleware/errorHandler';
import { sendSuccess, sendPaginated } from '../../utils/response';
import { MESSAGES } from '../../utils/messages';
import { parsePagination } from '../../utils/helpers';

const router = Router();

router.get('/', asyncHandler(async (req, res) => {
  const { page, limit, offset } = parsePagination(req.query);
  const { items, total } = await UserService.findAll(limit, offset);
  sendPaginated(res, items, total, page, limit, MESSAGES.SUCCESS.FETCHED);
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const user = await UserService.findById(req.params.id);
  if (!user) throw new NotFoundError('User');
  sendSuccess(res, user, MESSAGES.SUCCESS.FETCHED);
}));

router.post('/', asyncHandler(async (req, res) => {
  const user = await UserService.create(req.body);
  sendSuccess(res, user, MESSAGES.SUCCESS.CREATED, 201);
}));

export default router;

// src/routes/v1/index.ts
import userRoutes from './users';
router.use('/users', userRoutes);
```

---

## Error Handling

### Custom Errors

```typescript
import { NotFoundError, ValidationError, UnauthorizedError } from '../utils/errors';

throw new NotFoundError('User not found');
throw new ValidationError('Invalid input', { email: 'Required' });
throw new UnauthorizedError();
```

### Error Responses

```json
{
  "success": false,
  "message": "Validation error",
  "error": "{\"email\":\"Required\"}"
}
```

---

## Database

### Prisma Commands

```bash
# Generate client
pnpm exec prisma generate

# Run migrations
pnpm exec prisma migrate dev

# Open Prisma Studio
pnpm exec prisma studio

# Reset database
pnpm exec prisma migrate reset
```

### Switch to MySQL

```bash
cp prisma/schema.mysql.prisma prisma/schema.prisma
# Update .env: DB_PROVIDER=mysql, DATABASE_URL=mysql://...
pnpm exec prisma generate
```

---

## Logging

```typescript
import logger, { createLogger } from '../utils/logger';

logger.info('Server started');
logger.error('Operation failed', { error, context });

// Module-specific logger
const log = createLogger('UserService');
log.info('User created', { userId: 123 });
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Watch mode (tsx) |
| `pnpm build` | Compile to `dist/` |
| `pnpm start` | Run compiled JS |
| `pnpm exec prisma generate` | Generate Prisma client |
| `pnpm exec prisma migrate dev` | Run migrations |

---

## Production

```bash
pnpm build
NODE_ENV=production pnpm start
```

Ensure all required env vars are set. Logging switches to JSON format automatically.