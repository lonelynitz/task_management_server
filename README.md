# Task Management Backend

A Node.js/Express backend API with Prisma ORM, JWT authentication, and PostgreSQL database.

## Tech Stack

- **Runtime:** Node.js 20
- **Framework:** Express.js
- **Database:** PostgreSQL (via Prisma ORM)
- **Auth:** JWT (Access + Refresh tokens)
- **Language:** JavaScript (ES Modules)

## Prerequisites

- Node.js 20+
- PostgreSQL database (local or cloud like Aiven/Neon/Supabase)
- npm or yarn

## Local Development Setup

### 1. Install dependencies

```bash
npm install
```

> **Note:** The `prepare` script runs `npx prisma generate` automatically during install.

### 2. Set up environment variables

Create a `.env` file in the `backend/` directory:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/your_database"
JWT_ACCESS_SECRET="your-access-secret-key"
JWT_REFRESH_SECRET="your-refresh-secret-key"
PORT=5000
FRONTEND_URL="http://localhost:3000"
```

> **Note:** For cloud databases (Aiven, Neon, Supabase), append `?sslmode=no-verify` to your `DATABASE_URL`.

### 3. Generate Prisma client

```bash
npx prisma generate
```

### 4. Push database schema

```bash
npx prisma db push
```

### 5. Start the development server

```bash
npm run dev
```

The server will start at `http://localhost:5000`.

A default admin user is created automatically:
- **Username:** `admin`
- **Password:** `admin123`

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/register` | Register new user (admin only) |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/logout` | Logout user |
| GET | `/api/auth/me` | Get current user |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | Get all users |
| GET | `/api/users/:id` | Get user by ID |
| PUT | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Delete user |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks |
| GET | `/api/tasks/:id` | Get task by ID |
| POST | `/api/tasks` | Create task (admin only) |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task (admin only) |

### Health
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |

## Docker Setup

```bash
# From the project root
docker compose up --build
```

This will start:
- PostgreSQL on port `5432`
- Backend API on port `5000`

## Vercel Deployment

### Environment Variables

Set these in your Vercel project dashboard (Settings → Environment Variables):

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string with `?sslmode=no-verify` | `postgres://user:pass@host:5432/db?sslmode=no-verify` |
| `JWT_ACCESS_SECRET` | Secret key for access tokens | `your-random-access-secret` |
| `JWT_REFRESH_SECRET` | Secret key for refresh tokens | `your-random-refresh-secret` |
| `FRONTEND_URL` | Your frontend Vercel URL | `https://your-app.vercel.app` |
| `PORT` | Server port (optional, defaults to 5000) | `5000` |

### Deploy

Push to your Git repository. Vercel will auto-deploy using the `vercel.json` configuration.

## Project Structure

```
backend/
├── api/              # Vercel serverless entry (if using api/ convention)
├── middleware/
│   └── auth.js       # JWT authentication middleware
├── prisma/
│   ├── schema.prisma # Database schema
│   └── migrations/   # Database migrations
├── routes/
│   ├── auth.js       # Auth routes
│   ├── tasks.js      # Task routes
│   └── users.js      # User routes
├── utils/
│   └── jwt.js        # JWT helper functions
├── .env              # Environment variables (local, gitignored)
├── .env.prod         # Production env (gitignored)
├── package.json
├── prisma.config.ts  # Prisma configuration
├── prisma.js         # Prisma client setup
├── server.js         # Express app entry point
├── vercel.json       # Vercel deployment config
└── Dockerfile
```

## Default Credentials

| Username | Password | Role |
|----------|----------|------|
| `admin` | `admin123` | Admin |

> ⚠️ Change the admin password after first login in production.
