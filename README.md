# Full-Stack TypeScript Starter Template

A production-ready, scalable full-stack TypeScript template with a microservices architecture. Built with modern best practices for type safety, developer experience, and maintainability.

---

## Architecture Overview

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client    │────▶│  Gateway    │────▶│   Server    │
│  (Vite/     │     │  (Express)  │     │  (Express)  │
│   React)    │     │  Port 3000  │     │  Port 5000  │
└─────────────┘     └─────────────┘     └─────────────┘
       │                   │                   │
       ▼                   ▼                   ▼
  Port 5173         Rate Limit/CORS      Database (PostgreSQL)
                     Auth Validation
                     Request Proxy
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS v4, Radix UI |
| **Gateway** | Express 5, TypeScript, http-proxy-middleware |
| **Backend** | Express 5, TypeScript, Prisma ORM, PostgreSQL |
| **Auth** | JWT (planned), Gateway secret validation |
| **Logging** | Winston (structured, dev/prod formats) |
| **Validation** | Zod-ready validators, centralized messages |
| **Error Handling** | Global error handler, custom error classes |

---

## Features

- ✅ **Type-safe** end-to-end with TypeScript
- ✅ **Gateway pattern** — single entry point, backend protection
- ✅ **Standardized responses** — consistent API contracts
- ✅ **Global error handling** — centralized, typed errors
- ✅ **Request timeouts** — prevents hanging connections
- ✅ **Client-side abort** — cancels requests on navigation
- ✅ **Rate limiting** — configurable per endpoint
- ✅ **Environment validation** — fails fast on missing config
- ✅ **Structured logging** — Winston with dev/prod formats
- ✅ **Prisma ORM** — type-safe database access (PostgreSQL/MySQL)
- ✅ **Health checks** — `/api/v1/health` endpoints

---

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm 9+
- PostgreSQL 14+ (or MySQL 8+)

### Installation

```bash
# Clone and install all dependencies
git clone <your-repo>
cd fullstack-starter

# Install dependencies for all services
cd server && pnpm install
cd ../gateway && pnpm install
cd ../client && pnpm install
```

### Environment Setup

```bash
# Server
cd server
cp .env.example .env
# Edit .env with your database credentials

# Gateway
cd ../gateway
cp .env.example .env
# Edit .env (usually works out of the box)

# Client
cd ../client
cp .env.example .env
# Edit VITE_API_BASE_URL if needed
```

### Database Setup

```bash
cd server
# Generate Prisma client
pnpm exec prisma generate

# Run migrations (when models are added)
pnpm exec prisma migrate dev
```

### Development

```bash
# Terminal 1: Backend (port 5000)
cd server && pnpm dev

# Terminal 2: Gateway (port 3000)
cd gateway && pnpm dev

# Terminal 3: Frontend (port 5173)
cd client && pnpm dev
```

### Verify

```bash
# Gateway health
curl http://localhost:3000/gateway/health

# Backend health (via gateway)
curl http://localhost:3000/api/v1/health

# Backend direct (blocked without gateway)
curl http://localhost:5000/backend/health
```

---

## Project Structure

```
fullstack-starter/
├── client/                 # React + Vite + Tailwind
│   ├── src/
│   │   ├── lib/           # API client, hooks, utilities
│   │   ├── components/    # UI components (Radix-based)
│   │   ├── pages/         # Page components
│   │   └── config.ts      # App configuration
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── gateway/                # API Gateway (Express)
│   ├── src/
│   │   ├── config/        # Env, logger, proxy config
│   │   ├── middleware/    # Rate limiters
│   │   └── index.ts       # Entry point
│   ├── package.json
│   └── tsconfig.json
│
├── server/                 # Backend API (Express + Prisma)
│   ├── prisma/
│   │   ├── schema.prisma          # PostgreSQL schema
│   │   └── schema.mysql.prisma    # MySQL schema (manual switch)
│   ├── src/
│   │   ├── config/        # Env validation, database
│   │   ├── middleware/    # Error handler, timeout, gateway auth
│   │   ├── routes/        # API routes (v1)
│   │   ├── utils/         # Logger, responses, messages, validators
│   │   └── index.ts       # Entry point
│   ├── package.json
│   └── tsconfig.json
│
└── README.md              # This file
```

---

## API Conventions

### Response Format

```typescript
// Success
{
  "success": true,
  "data": { ... },
  "message": "Fetched successfully"
}

// Paginated
{
  "success": true,
  "data": [...],
  "message": "Fetched successfully",
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}

// Error
{
  "success": false,
  "message": "Resource not found",
  "error": "Additional details"
}
```

### Versioning

All routes are prefixed: `/api/v1/...`

---

## Security

- **Gateway** handles CORS, rate limiting, request logging
- **Backend** rejects requests without valid `X-Gateway-Secret` header
- **Frontend** only communicates with Gateway
- Environment secrets validated at startup

---

## Extending

### Add New Backend Route

```typescript
// server/src/routes/v1/users.ts
import { Router } from 'express';
import { asyncHandler } from '../../middleware/errorHandler';
import { sendSuccess } from '../../utils/response';
import { MESSAGES } from '../../utils/messages';

const router = Router();

router.get('/', asyncHandler(async (req, res) => {
  const users = await UserService.findAll();
  sendSuccess(res, users, MESSAGES.SUCCESS.FETCHED);
}));

export default router;

// server/src/routes/v1/index.ts
import userRoutes from './users';
router.use('/users', userRoutes);
```

### Switch Database (PostgreSQL ↔ MySQL)

```bash
# 1. Switch schema
cp prisma/schema.mysql.prisma prisma/schema.prisma

# 2. Update .env
DB_PROVIDER=mysql
DATABASE_URL=mysql://user:password@localhost:3306/dbname

# 3. Regenerate client
pnpm exec prisma generate
```

---

## Scripts Reference

| Service | Command | Description |
|---------|---------|-------------|
| **Server** | `pnpm dev` | Watch mode with tsx |
| | `pnpm build` | Compile TypeScript |
| | `pnpm start` | Run compiled JS |
| **Gateway** | `pnpm dev` | Watch mode |
| | `pnpm build` | Compile |
| **Client** | `pnpm dev` | Vite dev server |
| | `pnpm build` | Production build |
| | `pnpm lint` | ESLint |

---

## License

MIT — Use freely for any project.