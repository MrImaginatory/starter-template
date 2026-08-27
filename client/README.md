# Client — Frontend Application

React 19 + TypeScript + Vite + Tailwind CSS v4 + Radix UI component library.

---

## Features

- **React 19** with TypeScript (strict)
- **Vite** — Lightning-fast dev server & build
- **Tailwind CSS v4** — Utility-first styling
- **Radix UI** — Accessible, unstyled components
- **Axios** — HTTP client with interceptors
- **Request Abort** — Auto-cancels requests on navigation
- **Environment Config** — Vite env variables
- **ESLint + TypeScript** — Code quality

---

## Quick Start

```bash
cd client
pnpm install
cp .env.example .env
# Edit VITE_API_BASE_URL if needed
pnpm dev
```

Frontend runs on `http://localhost:5173`

---

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_API_BASE_URL` | No | `http://localhost:3000/api` | Gateway API base URL |
| `VITE_APP_NAME` | No | `Starter Kit` | App display name |
| `VITE_APP_TITLE` | No | `Starter Kit` | Browser tab title |
| `VITE_APP_DESCRIPTION` | No | — | Meta description |

---

## Project Structure

```
client/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   │   └── ui/            # Radix-based primitives
│   ├── lib/
│   │   ├── api.ts         # Axios client + helpers
│   │   ├── useApi.ts      # React hook with abort
│   │   ├── utils.ts       # Classnames, etc.
│   │   └── format.ts      # Formatters
│   ├── pages/             # Page components
│   ├── config.ts          # App configuration
│   ├── App.tsx            # Root component
│   └── main.tsx           # Entry point
├── package.json
├── tsconfig.json
├── vite.config.ts
└── .env.example
```

---

## API Client

### Basic Usage

```typescript
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api';

// GET
const users = await apiGet<User[]>('/users');

// POST
const user = await apiPost<User>('/users', { name: 'John' });

// PUT
const updated = await apiPut<User>('/users/1', { name: 'Jane' });

// DELETE
await apiDelete('/users/1');
```

### With Abort Signal (Auto-cancellation)

```typescript
import { useApi } from '@/lib/useApi';

function UserList() {
  const { get, abort } = useApi();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    get<User[]>('/users').then(setUsers).catch(console.error);
    return () => abort(); // Cancels on unmount
  }, [get]);

  return <UserTable users={users} />;
}
```

### Response Types

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// apiGet returns T directly (data field)
const users = await apiGet<User[]>('/users');
// users is User[]
```

### Authentication

Token automatically attached from `localStorage`:

```typescript
// Login
const { data } = await apiPost<{ token: string }>('/auth/login', credentials);
localStorage.setItem('token', data.token);

// Subsequent requests include Authorization: Bearer <token>
```

---

## UI Components

Built on Radix UI primitives with Tailwind CSS:

```typescript
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { Toast, ToastProvider } from '@/components/ui/toast';

// Usage
<Button variant="outline" size="sm">Cancel</Button>
<Input placeholder="Email" />
<Dialog>...</Dialog>
```

---

## Styling

### Tailwind CSS v4

```css
/* src/index.css */
@import "tailwindcss";

@theme {
  --color-primary: #3b82f6;
  --color-secondary: #64748b;
}
```

### Utility Functions

```typescript
import { cn } from '@/lib/utils';        // clsx + tailwind-merge
import { formatCurrency } from '@/lib/format';  // Currency formatting
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start Vite dev server |
| `pnpm build` | Production build (`dist/`) |
| `pnpm lint` | Run ESLint |
| `pnpm preview` | Preview production build |

---

## Adding Pages

```typescript
// src/pages/Dashboard.tsx
import { useApi } from '@/lib/useApi';
import { useEffect, useState } from 'react';

export function Dashboard() {
  const { get } = useApi();
  const [stats, setStats] = useState<Stats>();

  useEffect(() => {
    get<Stats>('/dashboard/stats').then(setStats);
  }, [get]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      {stats && <StatCards data={stats} />}
    </div>
  );
}
```

---

## Routing

Currently uses simple client-side routing. For complex apps, add React Router:

```bash
pnpm add react-router-dom
```

---

## Production Build

```bash
pnpm build
# Output in dist/
```

Deploy `dist/` to any static host (Vercel, Netlify, Cloudflare Pages, S3).

---

## Environment-Specific Builds

```bash
# Development
pnpm dev

# Staging
VITE_API_BASE_URL=https://staging-api.example.com/api pnpm build

# Production
VITE_API_BASE_URL=https://api.example.com/api pnpm build
```