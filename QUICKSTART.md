# Quick Start Guide

Get Moksh Sanskar Foundation running in 5 minutes!

## Prerequisites

### Option A: Docker (Easiest)
- Docker Desktop installed ([download here](https://www.docker.com/products/docker-desktop))

### Option B: Local Development
- Node.js 18+ ([download here](https://nodejs.org))
- MongoDB ([download here](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

---

## 🚀 Option 1: Docker (Recommended)

### 1. Clone and Setup
```bash
# Clone the repository
git clone <your-repo-url>
cd moksh-foundation

# Create environment file
cp .env.example .env

# Edit if needed (optional for basic testing)
# nano .env
```

### 2. Start Services
```bash
docker-compose up -d
```

### 3. Access Applications
```
Frontend: http://localhost:5173
Backend:  http://localhost:3000
API Docs: http://localhost:3000/health
```

### 4. Login to Admin Dashboard
```
URL: http://localhost:5173/admin
Email: admin@moksh.org
Password: admin123
```

### 5. Stop Services
```bash
docker-compose down
```

---

## 🚀 Option 2: Local Development

### 1. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Copy and configure environment
cp .env.example .env
nano .env  # Edit if needed

# Start backend server
npm run dev
```

Backend running at: `http://localhost:3000`

### 2. Frontend Setup (New Terminal)
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend running at: `http://localhost:5173`

### 3. Create First Admin User

Use the API to create admin:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@moksh.org",
    "password": "admin123"
  }'
```

Or insert directly into MongoDB:
```bash
mongosh mongodb://localhost:27017/moksh-foundation
```

```javascript
db.users.insertOne({
  name: "Admin",
  email: "admin@moksh.org",
  password: "$2b$10$...", // hashed password
  role: "admin",
  isActive: true
})
```

---

## 📱 Testing the Application

### Submit a Request
1. Go to: `http://localhost:5173/request-help`
2. Fill in the form:
   - Name: "Test Family"
   - Phone: "9876543210"
   - Email: "test@example.com"
   - City: "Mumbai"
   - Address: "123 Test Street"
   - Type: "Antim Sanskar Kit"
   - Description: "Test request"
3. Click "Submit Request"
4. You'll see a success message with tracking ID

### View Request in Admin Dashboard
1. Go to: `http://localhost:5173/login`
2. Login with:
   - Email: `admin@moksh.org`
   - Password: `admin123`
3. View the request you just submitted
4. Click "View Details" to manage it
5. Update status, add notes, send response

---

## 🔧 Common Commands

### Backend
```bash
cd backend

npm run dev          # Start development server
npm run build        # Build for production
npm start           # Run production build
npm run lint        # Check code quality
npm run format      # Format code with Prettier
npm run type-check  # Check TypeScript types
npm run test        # Run tests
```

### Frontend
```bash
cd frontend

npm run dev         # Start dev server
npm run build       # Build for production
npm run preview     # Preview production build
npm run lint        # Check code quality
npm run format      # Format code
npm run type-check  # Type checking
```

### Docker
```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Rebuild images
docker-compose build
```

---

## 📖 API Examples

### Submit Request
```bash
curl -X POST http://localhost:3000/api/requests \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "phone": "9876543210",
    "email": "john@example.com",
    "city": "Mumbai",
    "address": "123 Main Street",
    "typeOfHelp": "antim-kit",
    "description": "We need assistance with funeral arrangements",
    "urgencyLevel": "high"
  }'
```

### Admin Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@moksh.org",
    "password": "admin123"
  }'
```

### Get All Requests (Requires Token)
```bash
curl -X GET http://localhost:3000/api/requests \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Update Request Status (Requires Token)
```bash
curl -X PATCH http://localhost:3000/api/requests/REQUEST_ID/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "status": "approved",
    "responseMessage": "Your request has been approved",
    "adminNotes": "Assigned to volunteer"
  }'
```

---

## 🆘 Troubleshooting

### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 PROCESS_ID
```

### MongoDB Connection Error
```bash
# Check if MongoDB is running
mongosh

# If using Docker, check service
docker-compose ps
```

### Frontend Shows Blank Page
```bash
# Check .env configuration
cat frontend/.env

# Rebuild frontend
cd frontend
npm run build
npm run preview
```

### API Errors
1. Check backend logs: `npm run dev`
2. Verify CORS_ORIGIN in backend .env
3. Check network tab in browser DevTools
4. Verify MongoDB is running

### Docker Issues
```bash
# Rebuild images
docker-compose build --no-cache

# Remove old containers
docker-compose down -v

# Start fresh
docker-compose up -d
```

---

## 📁 Important Files

| File | Purpose |
|------|---------|
| `backend/.env` | Backend configuration |
| `frontend/.env` | Frontend configuration |
| `docker-compose.yml` | Docker services setup |
| `docs/API.md` | API documentation |
| `docs/SETUP.md` | Deployment guide |
| `docs/DATABASE.md` | Database schema |

---

## 🔐 Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/moksh-foundation
JWT_SECRET=your-secret-key-min-32-characters
CORS_ORIGIN=http://localhost:5173
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email
SMTP_PASSWORD=your-app-password
SENDER_EMAIL=noreply@moksh.org
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000/api
```

---

## 📚 Next Steps

1. **Explore the Code**
   - Check `frontend/src/pages` for page structure
   - Check `backend/src/controllers` for API logic
   - Review `backend/src/models` for database schema

2. **Read Documentation**
   - `README.md` - Project overview
   - `docs/API.md` - API endpoints
   - `docs/DATABASE.md` - Database structure
   - `docs/SETUP.md` - Production deployment

3. **Test the Features**
   - Submit a request
   - Login as admin
   - View requests
   - Update status
   - Send messages

4. **Customize**
   - Update colors in `frontend/tailwind.config.js`
   - Modify email templates in `backend/src/services/EmailService.ts`
   - Add new fields to database models

---

## 🎯 Default Test Credentials

```
Email: admin@moksh.org
Password: admin123
```

---

## 📞 Need Help?

- Check the documentation in `/docs`
- Review test files in `/backend/tests`
- Check error messages in browser console
- Check server logs in terminal
- Email: support@moksh.org

---

## 🎉 You're All Set!

Your Moksh Sanskar Foundation platform is now running.

**Start with:**
1. Visit http://localhost:5173 (Frontend)
2. Click "Request Help" to submit a request
3. Go to "/admin" or "/login" to access admin dashboard
4. Login with admin@moksh.org / admin123

**Happy coding! Contributing to compassion, one request at a time.** 🙏
