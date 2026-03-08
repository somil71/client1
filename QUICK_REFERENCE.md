# 🚀 Quick Reference - Admin Authentication

## Login Credentials
```
Email: admin@moksh.org
Password: admin123
```

## Test Login (cURL)
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@moksh.org","password":"admin123"}'
```

## Expected Response
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {...},
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

## Use Token for Protected Routes
```bash
curl -H "Authorization: Bearer {TOKEN}" \
  http://localhost:3000/api/requests
```

## System URLs
- 🌐 Frontend: http://localhost:5173
- 🔌 Backend: http://localhost:3000
- 👥 Admin Dashboard: http://localhost:5173/admin
- 📋 Request Form: http://localhost:5173/request-help

## Fixed Issues
✅ Environment variables loading (.env)
✅ MongoDB connection (localhost:27017)
✅ Admin password hashing
✅ JWT token generation
✅ Port conflicts resolved
✅ Temporary files cleaned

---
**All systems operational. Ready to use!** ✨
