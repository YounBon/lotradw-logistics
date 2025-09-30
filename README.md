# LoTraDW - Logistics Management System

A comprehensive logistics management platform built with modern web technologies.

## Tech Stack

- **Backend**: NestJS + TypeScript
- **Frontend**: Next.js + TypeScript
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Styling**: Tailwind CSS
- **Authentication**: JWT

## Features

### Customer Features
- ✅ User Registration & Login
- ✅ Profile Management
- ✅ Order Creation & Management
- ✅ Carrier Suggestions (DSS)
- ✅ Quick Quote
- ✅ ETA Prediction
- ✅ Order Tracking Timeline
- ✅ Order History & Invoice Download
- ✅ Service Rating

## Project Structure

```
LoTraDW-logistics/
├── backend/                 # NestJS API Server
│   ├── src/
│   │   ├── modules/        # Feature modules
│   │   ├── entities/       # Database entities
│   │   ├── dto/           # Data transfer objects
│   │   └── main.ts        # Entry point
│   └── package.json
├── frontend/               # Next.js Client App
│   ├── src/
│   │   ├── app/           # App router
│   │   ├── components/    # Reusable components
│   │   ├── types/         # TypeScript types
│   │   └── utils/         # Utility functions
│   └── package.json
├── database/              # Database scripts
└── docker-compose.yml     # Development setup
```

## Getting Started

### Prerequisites
- Node.js (v18+)
- Docker & Docker Compose
- PostgreSQL (or use Docker)

### Development Setup

1. Clone the repository
2. Install dependencies for both frontend and backend
3. Setup environment variables
4. Run the development servers

Detailed instructions in each module's README.