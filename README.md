# Room Rental Platform

A modern, full-stack web application designed for students and landlords to seamlessly manage room rentals, bookings, and real-time communications.

## Architecture Highlights
- **Frontend**: Next.js 14, TailwindCSS, Framer Motion, React Hot Toast
- **Backend**: NestJS, Prisma ORM, JWT Authentication, Server-Sent Events (SSE)
- **Database**: PostgreSQL 15, Redis 7
- **Deployment**: Fully Containerized (Docker, Docker Compose)
- **CI/CD**: GitHub Actions

## Features
- **Role-based Dashboards**: Custom interfaces for Students, Landlords, and Admins.
- **Real-time Notifications**: Backend-driven Server-Sent Events pushed instantly to the user interface.
- **Advanced API Routing**: Built-in Next.js Proxy Rewrites seamlessly routing traffic internally across Docker containers.
- **Dynamic Theming**: Dark/Light mode out of the box with responsive UI.

## Getting Started

The platform is designed to be highly portable and easily deployable using Docker.

For full deployment instructions, environment variable configurations, and maintenance commands, please refer to the **[Deployment Guide](DEPLOYMENT.md)**.

### Quick Start (Docker)
```bash
# Clone the repository
git clone <repository_url>
cd room-rental

# Start all services (Database, Redis, Backend, Frontend)
docker-compose up -d --build
```

Access the application at `http://localhost:3000`.

## CI/CD Pipeline

This repository includes a robust **GitHub Actions** CI/CD pipeline (`.github/workflows/ci.yml`) that triggers automatically on pushes and pull requests to the `main` or `master` branches.

### Pipeline Stages
1. **Backend CI**: 
   - Installs dependencies.
   - Runs backend unit/integration tests (`npm run test`).
   - Verifies the build process (`npm run build`).
2. **Frontend CI**:
   - Installs dependencies.
   - Enforces code quality (`npm run lint`).
   - Verifies Next.js static and dynamic optimizations (`npm run build`).
3. **Docker Build Test**:
   - Tests containerization integrity.
   - Builds both the `room-rental-backend` and `room-rental-frontend` images securely.
   - Leverages GitHub Actions caching to massively speed up subsequent builds.

This pipeline ensures that every commit pushed to the repository is production-ready and fully deployable.
