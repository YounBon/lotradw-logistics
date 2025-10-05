# LoTraDW Logistics Platform

Hệ thống quản lý logistics toàn diện với công nghệ hiện đại.

## Tech Stack

- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS
- **Backend**: NestJS + TypeORM + PostgreSQL
- **Database**: PostgreSQL
- **Deployment**: Vercel

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Features

### Customer Portal
- User registration and authentication
- Order management and tracking
- Quote requests
- Profile management
- Rating and feedback system

### Carrier Portal
- Carrier registration and login
- Dashboard with key metrics
- Fleet management
- Order assignment and tracking
- Schedule management
- Reports and analytics

## Environment Setup

Copy `.env.example` to `.env.local` and configure your environment variables:

```bash
cp .env.example .env.local
```

Configure the following variables:
- Database connection URL
- JWT secret key
- API endpoints

## Development

```bash
# Start frontend development server
npm run dev

# Backend setup (optional)
cd backend
npm install
docker-compose up -d postgres
npm run start:dev
```

## Deployment

The frontend application is automatically deployed to Vercel when pushing to the main branch.

## Project Structure

```
src/
├── app/                    # Next.js App Router
├── components/             # Reusable components
├── hooks/                  # Custom React hooks
├── lib/                    # Utilities and services
└── types/                  # TypeScript definitions

backend/                    # NestJS API server
public/                     # Static assets
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint