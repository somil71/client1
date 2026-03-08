# Moksh Sanskar Foundation Platform

A production-ready web platform for a charitable foundation dedicated to supporting families during funeral arrangements. Built with a modern, scalable architecture.

## 🎯 Project Overview

Moksh Sanskar Foundation helps families by providing:
- Free Antim Sanskar Kits
- Pandit Assistance
- Eco-Friendly Cremation Support
- Community Support

## 🛠 Tech Stack

**Frontend:**
- React 18+ with Vite
- TypeScript
- TailwindCSS
- React Router
- Axios
- Framer Motion

**Backend:**
- Node.js 18+
- Express.js
- TypeScript
- MongoDB with Mongoose

**Infrastructure:**
- Docker & Docker Compose
- JWT Authentication
- Bcrypt for password hashing

## 📁 Project Structure

```
moksh-foundation/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── utils/
│   │   └── App.tsx
│   ├── public/
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── package.json
├── backend/                  # Express API
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── middleware/
│   │   ├── utils/
│   │   ├── config/
│   │   └── index.ts
│   ├── tests/
│   ├── tsconfig.json
│   ├── .env.example
│   └── package.json
├── docs/                     # Documentation
│   ├── API.md
│   ├── DATABASE.md
│   └── SETUP.md
├── docker-compose.yml
├── README.md
└── .gitignore
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB 5+
- Docker & Docker Compose (for containerized setup)

### Local Development

#### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

#### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

#### 3. Database

MongoDB should be running (Docker setup handles this automatically)

### Docker Setup

```bash
docker-compose up -d
```

This starts:
- Frontend (http://localhost:5173)
- Backend (http://localhost:3000)
- MongoDB (port 27017)

## 📝 Environment Variables

### Backend (.env)

```
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/moksh-foundation
JWT_SECRET=your-secret-key-min-32-chars
JWT_EXPIRY=7d
BCRYPT_ROUNDS=10

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SENDER_EMAIL=noreply@moksh.org

# CORS
CORS_ORIGIN=http://localhost:5173

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=pdf,jpg,jpeg,png,doc,docx
```

### Frontend (.env)

```
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=Moksh Sanskar Foundation
```

## 🔑 Key Features

### For Families
- ✅ Submit assistance requests with detailed information
- ✅ Upload supporting documents
- ✅ Track request status
- ✅ Receive email notifications
- ✅ Emergency contact information

### For Admins
- ✅ Secure login dashboard
- ✅ View all requests with filters
- ✅ Review request details
- ✅ Accept/Reject requests
- ✅ Assign volunteers
- ✅ Send response messages
- ✅ View impact statistics

## 🔒 Security Features

- JWT-based authentication
- Password hashing with Bcrypt
- Input validation (Zod schema validation)
- CSRF protection with Helmet
- Rate limiting
- CORS protection
- Secure file upload validation

## 📊 API Endpoints

### Public Routes
- `POST /api/requests` - Submit assistance request
- `GET /api/requests/:id` - Get request details (with tracking)

### Admin Routes (Protected)
- `POST /api/auth/login` - Admin login
- `POST /api/auth/register` - Create admin (super-admin only)
- `GET /api/requests` - List all requests with pagination
- `GET /api/requests/:id` - View request details
- `PATCH /api/requests/:id/status` - Update request status
- `POST /api/requests/:id/assign` - Assign volunteer
- `POST /api/requests/:id/message` - Send response message
- `GET /api/dashboard/stats` - Get dashboard statistics

## 📚 Documentation

- [API Documentation](./docs/API.md)
- [Database Schema](./docs/DATABASE.md)
- [Setup Guide](./docs/SETUP.md)

## 🧪 Testing

```bash
# Backend tests
cd backend
npm run test

# Frontend tests
cd frontend
npm run test
```

## 📦 Deployment

### Docker Build

```bash
docker build -f Dockerfile.backend -t moksh-backend .
docker build -f Dockerfile.frontend -t moksh-frontend .
```

### Production Environment

Set environment variables for production before deploying.

## 🤝 Development

### Code Quality

- ESLint: `npm run lint`
- Prettier: `npm run format`
- Type checking: `npm run type-check`

### Development Commands

```bash
# Backend
npm run dev        # Development server
npm run build      # Production build
npm run start      # Production server

# Frontend
npm run dev        # Development server
npm run build      # Production build
npm run preview    # Preview production build
```

## 📄 License

This project is built for Moksh Sanskar Foundation. All rights reserved.

## 🙏 Support

For questions or issues, please contact:
- Email: support@moksh.org
- Phone: [Contact Number]

---

Built with ❤️ for Moksh Sanskar Foundation
