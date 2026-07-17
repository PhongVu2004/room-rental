# Deployment Guide: Room Rental Platform

This guide will walk you through deploying the Room Rental Platform using our fully containerized Docker architecture. 

The architecture includes:
- **Next.js Frontend**: The web client.
- **NestJS Backend**: The API server.
- **PostgreSQL**: The relational database for persistent storage.
- **Redis**: An in-memory data store for caching and queues (Ready Architecture).

## Prerequisites
- **Docker** & **Docker Compose** installed on your server or local machine.
- **Node.js** (optional, for local development outside Docker).

## 1. Environment Setup

Before starting the containers, ensure you have your `.env` files correctly set up. 

### Backend `.env` (`backend/.env`)
```env
DATABASE_URL="postgresql://postgres:postgres@db:5432/room_rental?schema=public"
REDIS_URL="redis://redis:6379"

JWT_SECRET="your-super-secret-jwt-key"

MAIL_HOST="smtp.gmail.com"
MAIL_PORT="587"
MAIL_USER="your-email@gmail.com"
MAIL_PASS="your-app-password"
MAIL_FROM="No Reply <noreply@roomrental.com>"
```

### Frontend `.env` (`frontend/.env`)
For Docker deployments, the API URL is dynamically handled via Next.js Proxy Rewrites. You do not strictly need a `.env` file unless you want to override public variables.
```env
NEXT_PUBLIC_API_URL=/api/proxy
```

## 2. Docker Architecture Overview

Our `docker-compose.yml` links 4 essential services:
- `db`: PostgreSQL 15, mapped to port `5432` with a persistent volume (`postgres_data`).
- `redis`: Redis 7, mapped to port `6379` with a persistent volume (`redis_data`).
- `backend`: NestJS Server, mapped to port `3001`. Depends on `db` and `redis`.
- `frontend`: Next.js Web App, mapped to port `3000`. Proxies API requests automatically to `backend:3001` to bypass CORS and mixed-content issues.

## 3. Launching the Platform

To start the entire platform, run the following command from the root directory:

```bash
docker-compose up -d --build
```

### What this does:
1. Pulls the PostgreSQL and Redis images.
2. Builds the Backend Docker image, automatically generating Prisma client and installing dependencies.
3. Builds the Frontend Docker image, pre-rendering static Next.js pages and configuring the API proxy.
4. Starts all containers in the correct dependency order (`db` & `redis` -> `backend` -> `frontend`).

> [!TIP]
> The `-d` flag runs the containers in the background (detached mode). The `--build` flag ensures Dockerfile changes are compiled.

## 4. Database Migrations

Once the `backend` and `db` containers are running, you need to push the Prisma database schema to PostgreSQL. 

Run the following command:
```bash
docker exec -it room-rental-backend npx prisma db push --schema=../database/prisma/schema.prisma
```
*(If you have seed data, you can run `npx prisma db seed` afterwards).*

## 5. Accessing the Application

- **Frontend App**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:3001](http://localhost:3001)

> [!NOTE]
> If you are exposing the app to the internet via Localtunnel or Ngrok, you **only** need to tunnel the Frontend port (`3000`). The frontend will securely route `/api/proxy/*` traffic directly to the backend through the internal Docker network.

## 6. Maintenance Commands

**View Logs:**
```bash
# View all logs
docker-compose logs -f

# View only backend logs
docker logs -f room-rental-backend
```

**Stop Services:**
```bash
docker-compose down
```

**Restart a single service:**
```bash
docker-compose restart frontend
```

**Completely wipe data (CAUTION):**
```bash
docker-compose down -v
```
*(This will delete your PostgreSQL and Redis volumes, wiping all user and room data).*
