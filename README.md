# LoTraDW Logistics Platform

A comprehensive logistics management system built with modern web technologies.

## 🏗️ **Tech Stack**

- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS
- **Backend**: NestJS + TypeORM + PostgreSQL
- **Deployment**: Vercel (Frontend) + Docker (Backend)
- **Authentication**: JWT + Passport.js

## 🚀 **Features**

### Customer Portal
- ✅ User registration and authentication
- ✅ Order management and tracking
- ✅ Quote requests
- ✅ Profile management
- ✅ Rating and feedback system

### Carrier Portal
- ✅ Carrier registration and authentication
- ✅ Fleet management
- ✅ Order management
- ✅ Schedule management
- ✅ Reports and analytics
- ✅ Dashboard with KPIs

## 📦 **Project Structure**

```
📦 LoTraDW-logistics/
├── 📁 src/                    # Frontend source code
│   ├── 📁 app/                # Next.js App Router
│   ├── 📁 components/         # Reusable React components
│   ├── 📁 constants/          # Application constants
│   ├── 📁 hooks/              # Custom React hooks
│   ├── 📁 lib/                # Utility libraries
│   └── 📁 types/              # TypeScript definitions
├── 📁 backend/                # NestJS API server
├── 📁 public/                 # Static assets
├── 🐳 docker-compose.yml      # Database services
├── 📋 package.json            # Dependencies & scripts
└── 🚀 vercel.json             # Deployment config
```

## 🛠️ **Getting Started**

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Docker (for database)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YounBon/lotradw-logistics.git
   cd lotradw-logistics
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start the database**
   ```bash
   docker-compose up -d postgres
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001 (when implemented)

## 📜 **Available Scripts**

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 🌐 **Deployment**

### Vercel (Frontend)
The frontend is automatically deployed to Vercel when pushing to the main branch.

### Docker (Backend)
```bash
cd backend
docker build -t lotradw-backend .
docker run -p 3001:3001 lotradw-backend
```

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 **License**

This project is private and proprietary.

## 📞 **Contact**

For questions or support, please contact the development team.

---

**Built with ❤️ using Next.js and NestJS**
