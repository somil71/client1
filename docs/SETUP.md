# Setup and Deployment Guide

Complete guide for setting up and deploying Moksh Sanskar Foundation platform.

## Table of Contents
1. [Local Development Setup](#local-development-setup)
2. [Docker Setup](#docker-setup)
3. [Production Deployment](#production-deployment)
4. [Environment Configuration](#environment-configuration)
5. [Database Setup](#database-setup)
6. [First-Time Admin Setup](#first-time-admin-setup)
7. [Monitoring & Logs](#monitoring--logs)

---

## Local Development Setup

### Prerequisites
- Node.js 18+ (download from https://nodejs.org)
- MongoDB 5+ (download or use MongoDB Atlas)
- Git
- Code editor (VS Code recommended)

### Step 1: Clone Repository
```bash
git clone <repository-url>
cd moksh-foundation
```

### Step 2: Backend Setup

```bash
cd backend

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
# Important: Update SMTP credentials for email functionality
nano .env

# Install dependencies
npm install

# Start development server
npm run dev
```

Backend will be available at `http://localhost:3000`

### Step 3: Frontend Setup

Open new terminal:

```bash
cd frontend

# Copy environment file
cp .env.example .env

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will be available at `http://localhost:5173`

### Step 4: Create First Admin User

Open MongoDB connection:
```bash
mongosh mongodb://localhost:27017/moksh-foundation
```

Create admin user (you can use the register endpoint with an existing admin):
```javascript
use moksh-foundation
db.users.insertOne({
  name: "Admin Name",
  email: "admin@moksh.org",
  password: "$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/TVm6", // password: admin123
  role: "admin",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

Or use the API (after backend starts):
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin",
    "email": "admin@moksh.org",
    "password": "Admin123!",
    "role": "admin"
  }'
```

---

## Docker Setup

### Prerequisites
- Docker Desktop (https://www.docker.com/products/docker-desktop)
- Docker Compose

### Quick Start

```bash
# Clone repository
git clone <repository-url>
cd moksh-foundation

# Create .env file for production
cat > .env << EOF
JWT_SECRET=your-very-secret-key-min-32-characters
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SENDER_EMAIL=noreply@moksh.org
EOF

# Start services
docker-compose up -d

# Check services are running
docker-compose ps

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

Services will be available at:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`
- MongoDB: `localhost:27017`

### Seed First Admin

```bash
docker-compose exec mongodb mongosh moksh-foundation << EOF
db.users.insertOne({
  name: "Admin",
  email: "admin@moksh.org",
  password: "\$2b\$10\$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/TVm6",
  role: "admin",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
})
EOF
```

### Stop Services

```bash
docker-compose down

# Also remove volumes (careful - deletes data)
docker-compose down -v
```

---

## Production Deployment

### Option 1: Traditional Server (Ubuntu/Debian)

#### 1. Setup Server

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MongoDB
curl https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# Install PM2 for process management
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx
```

#### 2. Clone and Setup Application

```bash
# Clone repo
cd /var/www
sudo git clone <repository-url> moksh-foundation
cd moksh-foundation

# Setup backend
cd backend
npm install --production
cp .env.example .env
# Edit .env with production values
nano .env

# Setup frontend
cd ../frontend
npm install
npm run build

# Start with PM2
cd ../backend
pm2 start "npm start" --name "moksh-backend"
pm2 save
sudo pm2 startup
```

#### 3. Configure Nginx

Create `/etc/nginx/sites-available/moksh-foundation`:

```nginx
upstream backend {
    server 127.0.0.1:3000;
}

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Frontend
    location / {
        root /var/www/moksh-foundation/frontend/dist;
        try_files $uri $uri/ /index.html;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # API
    location /api/ {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/moksh-foundation /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 4. Setup SSL with Let's Encrypt

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### Option 2: Docker on Server

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Clone and deploy
cd /var/www
sudo git clone <repository-url> moksh-foundation
cd moksh-foundation

# Create .env
sudo nano .env

# Start services
sudo docker-compose up -d

# Setup Nginx reverse proxy (same as above)
```

### Option 3: Cloud Platforms

#### Heroku
```bash
heroku create moksh-foundation
heroku addons:create mongolab:sandbox
git push heroku main
```

#### AWS (with Elastic Beanstalk)
```bash
eb init moksh-foundation --platform node.js --region us-east-1
eb create moksh-prod
eb deploy
```

#### DigitalOcean (App Platform)
1. Push code to GitHub
2. Create app in DigitalOcean App Platform
3. Connect GitHub repository
4. Set environment variables
5. Deploy

---

## Environment Configuration

### Production .env Template

```bash
# App
NODE_ENV=production
PORT=3000

# Database
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/moksh-foundation

# JWT
JWT_SECRET=generate-a-random-32-character-secret-key-here
JWT_EXPIRY=7d

# BCRYPT
BCRYPT_ROUNDS=12

# CORS
CORS_ORIGIN=https://yourdomain.com

# Email (Gmail setup)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-specific-password
SENDER_EMAIL=noreply@moksh.org

# File Upload
UPLOAD_DIR=/var/uploads/moksh-foundation
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=pdf,jpg,jpeg,png,doc,docx

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
```

#### Generate Secure JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### Gmail App Password
1. Enable 2FA on Google Account
2. Go to https://myaccount.google.com/apppasswords
3. Generate app password for Mail
4. Use this password in SMTP_PASSWORD

---

## Database Setup

### MongoDB Atlas (Recommended)

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Create database user with strong password
4. Whitelist IP addresses
5. Get connection string
6. Update MONGODB_URI in .env

### Local MongoDB

```bash
# Start service
sudo systemctl start mongod

# Connect
mongosh mongodb://localhost:27017/moksh-foundation

# Create admin user
use moksh-foundation
db.createCollection("requests")
db.createCollection("users")
```

### Backup Strategy

```bash
# Daily backup script (/usr/local/bin/backup-moksh.sh)
#!/bin/bash
BACKUP_DIR="/backups/moksh-foundation"
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --uri "mongodb://localhost:27017/moksh-foundation" --out "$BACKUP_DIR/$DATE"
find "$BACKUP_DIR" -type d -mtime +30 -exec rm -rf {} \;
```

Schedule with cron:
```bash
0 2 * * * /usr/local/bin/backup-moksh.sh
```

---

## First-Time Admin Setup

### 1. Register First Admin
```bash
curl -X POST https://yourdomain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@moksh.org",
    "password": "SecurePassword123!"
  }'
```

### 2. Login to Dashboard
Visit: `https://yourdomain.com/admin`

### 3. Create Staff Users
Use admin dashboard to create additional staff members

### 4. Configure Settings
- Email templates
- Support contact information
- Donation settings

---

## Monitoring & Logs

### PM2 Monitoring

```bash
pm2 status
pm2 logs moksh-backend
pm2 save
pm2 startup
```

### Docker Logs

```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb

# Save logs
docker-compose logs --tail=100 backend > backend.log
```

### Application Logs

Logs are stored in:
- Backend: `backend/logs/`
- Frontend: Browser console
- Database: `/var/log/mongodb/`

### Monitoring Tools

Consider setting up:
1. **PM2 Plus** - PM2 monitoring dashboard
2. **DataDog** - Application performance monitoring
3. **Sentry** - Error tracking
4. **CloudFlare** - DDoS protection
5. **Let's Encrypt** - SSL certificate management

---

## Troubleshooting

### Backend won't start
```bash
# Check port 3000 is free
lsof -i :3000

# Check environment variables
env | grep NODE_ENV
cat backend/.env

# Check database connection
mongosh $MONGODB_URI
```

### Frontend blank page
```bash
# Check API URL
cat frontend/.env

# Check browser console for errors
# Clear cache and rebuild
npm run build
```

### Database connection issues
```bash
# Test connection
mongosh "mongodb://localhost:27017/moksh-foundation"

# Check connection string
echo $MONGODB_URI
```

---

## Support & Maintenance

1. **Weekly Tasks:**
   - Check logs for errors
   - Monitor disk usage
   - Verify backups

2. **Monthly Tasks:**
   - Update dependencies: `npm update`
   - Review security updates
   - Check SSL certificate expiry

3. **Quarterly Tasks:**
   - Performance optimization
   - Database cleanup
   - Security audit

---

## Support

For deployment issues: support@moksh.org
