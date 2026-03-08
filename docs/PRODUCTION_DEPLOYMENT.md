# Production Deployment Architecture — Moksh Sanskar Foundation

> A complete, production-grade deployment playbook.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Cloud Infrastructure](#2-cloud-infrastructure)
3. [Server Provisioning](#3-server-provisioning)
4. [Container Deployment](#4-container-deployment)
5. [Domain and SSL](#5-domain-and-ssl)
6. [Database Setup](#6-database-setup)
7. [Automated Deployment](#7-automated-deployment)
8. [Security Hardening](#8-security-hardening)
9. [Observability](#9-observability)
10. [Scaling Strategy](#10-scaling-strategy)

---

## 1. Architecture Overview

```
                    ┌──────────────────────────┐
                    │      Cloudflare DNS       │
                    │   (DDoS • CDN • WAF)      │
                    └────────────┬─────────────┘
                                 │ HTTPS (443)
                    ┌────────────▼─────────────┐
                    │   Nginx Reverse Proxy     │
                    │  (Let's Encrypt SSL)      │
                    │   Rate Limiting • GZIP    │
                    └──┬────────────────────┬──┘
           /api/*      │                    │  /*
        ┌──────────────▼──┐          ┌──────▼──────────────┐
        │  Backend (3000) │          │  Frontend (5173)     │
        │  Node/Express   │          │  serve (static SPA)  │
        │  Docker         │          │  Docker              │
        └────────┬────────┘          └─────────────────────┘
                 │
        ┌────────▼────────┐
        │  MongoDB Atlas  │
        │  (Managed DB)   │
        └─────────────────┘
```

**Traffic Flow:** User → Cloudflare → Nginx → Docker containers → MongoDB Atlas

---

## 2. Cloud Infrastructure

### Recommended Provider: DigitalOcean

| Resource | Spec | Monthly Cost |
|---|---|---|
| Droplet (App Server) | 2 vCPU, 4 GB RAM, 80 GB SSD (Ubuntu 22.04) | ~$24 |
| MongoDB Atlas (M10) | Dedicated cluster, 10 GB storage | ~$57 |
| Domain (.org) | Via Namecheap/GoDaddy | ~$10/yr |
| Cloudflare (Free Tier) | DNS + CDN + Basic DDoS | $0 |
| **Total** | | **~$81/mo** |

> **Why DigitalOcean?** Simple pricing, excellent Docker support, Bangalore datacenter for low-latency India access, and SSH-ready Ubuntu images. For heavier loads, swap to AWS EC2 `t3.medium`.

---

## 3. Server Provisioning

### 3.1 Initial Ubuntu Setup

SSH into your new Droplet and run:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Create deploy user (never run apps as root)
sudo adduser deploy
sudo usermod -aG sudo deploy

# Lockdown SSH — disable root login and password auth
sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
sudo sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
sudo systemctl restart sshd

# Set timezone
sudo timedatectl set-timezone Asia/Kolkata

# Install essential tools
sudo apt install -y curl wget git ufw fail2ban
```

### 3.2 Install Docker

```bash
# Docker official install
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Allow deploy user to use Docker without sudo
sudo usermod -aG docker deploy

# Install Docker Compose plugin
sudo apt install -y docker-compose-plugin

# Verify
docker --version
docker compose version
```

### 3.3 Install Nginx

```bash
sudo apt install -y nginx
sudo systemctl enable nginx
```

### 3.4 Firewall (UFW)

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp      # SSH
sudo ufw allow 80/tcp      # HTTP
sudo ufw allow 443/tcp     # HTTPS
sudo ufw enable
sudo ufw status verbose
```

### 3.5 Fail2Ban (Brute Force Protection)

```bash
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

---

## 4. Container Deployment

### 4.1 Authenticate with GHCR

Generate a GitHub Personal Access Token (PAT) with `read:packages` scope at https://github.com/settings/tokens.

```bash
# On the server, as deploy user
echo "YOUR_GITHUB_PAT" | docker login ghcr.io -u somil71 --password-stdin
```

### 4.2 Create Project Directory

```bash
sudo mkdir -p /opt/moksh-foundation
sudo chown deploy:deploy /opt/moksh-foundation
cd /opt/moksh-foundation
```

### 4.3 Create Production Docker Compose

Create `/opt/moksh-foundation/docker-compose.yml`:

```yaml
version: '3.8'

services:
  backend:
    image: ghcr.io/somil71/client1/backend:latest
    container_name: moksh-backend
    restart: always
    env_file:
      - .env.backend
    environment:
      NODE_ENV: production
      PORT: 3000
    ports:
      - "127.0.0.1:3000:3000"   # Bind to localhost only, Nginx handles external
    volumes:
      - uploads:/app/uploads
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:3000/health', r => { if(r.statusCode!==200) throw 1 })"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 15s

  frontend:
    image: ghcr.io/somil71/client1/frontend:latest
    container_name: moksh-frontend
    restart: always
    depends_on:
      backend:
        condition: service_healthy
    ports:
      - "127.0.0.1:5173:5173"   # Bind to localhost only
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:5173"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  uploads:
    driver: local
```

> **Note:** MongoDB is removed from Docker. We use managed MongoDB Atlas instead (see Section 6).

### 4.4 Create Backend Environment File

Create `/opt/moksh-foundation/.env.backend`:

```bash
NODE_ENV=production
PORT=3000

# MongoDB Atlas connection (see Section 6)
MONGODB_URI=mongodb+srv://moksh_user:<PASSWORD>@cluster0.xxxxx.mongodb.net/moksh-foundation?retryWrites=true&w=majority

# JWT — generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=<YOUR_64_CHAR_HEX_SECRET>
JWT_EXPIRY=7d

# CORS — set to your actual domain
CORS_ORIGIN=https://moksh.org

# SMTP (Gmail App Password)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SENDER_EMAIL=noreply@moksh.org

# File Upload
UPLOAD_DIR=/app/uploads
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=pdf,jpg,jpeg,png,doc,docx

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
```

### 4.5 Pull and Launch

```bash
cd /opt/moksh-foundation
docker compose pull
docker compose up -d
docker compose ps        # Verify all services are healthy
docker compose logs -f   # Watch live logs
```

---

## 5. Domain and SSL

### 5.1 DNS Configuration

| Record | Host | Value | TTL |
|---|---|---|---|
| A | `@` | `YOUR_DROPLET_IP` | 300 |
| A | `www` | `YOUR_DROPLET_IP` | 300 |
| CNAME | `api` | `@` | 300 |

If using Cloudflare, enable the orange cloud (proxy) for DDoS protection.

### 5.2 Nginx Site Configuration

Create `/etc/nginx/sites-available/moksh-foundation`:

```nginx
# Rate limiting zone
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=30r/s;
limit_req_zone $binary_remote_addr zone=general:10m rate=60r/s;

upstream backend {
    server 127.0.0.1:3000;
    keepalive 32;
}

upstream frontend {
    server 127.0.0.1:5173;
}

server {
    listen 80;
    server_name moksh.org www.moksh.org;

    # GZIP
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types text/plain text/css text/xml text/javascript
               application/json application/javascript application/xml
               application/rss+xml image/svg+xml;

    # API
    location /api/ {
        limit_req zone=api_limit burst=20 nodelay;
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_read_timeout 60s;
        proxy_connect_timeout 60s;
        client_max_body_size 10m;
    }

    # Frontend
    location / {
        limit_req zone=general burst=40 nodelay;
        proxy_pass http://frontend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
    }

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
}
```

Enable the site:

```bash
sudo ln -sf /etc/nginx/sites-available/moksh-foundation /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

### 5.3 HTTPS with Let's Encrypt

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain certificate (auto-configures Nginx)
sudo certbot --nginx -d moksh.org -d www.moksh.org --non-interactive --agree-tos -m admin@moksh.org

# Verify auto-renewal
sudo certbot renew --dry-run

# Certbot installs a systemd timer for auto-renewal. Verify:
sudo systemctl status certbot.timer
```

---

## 6. Database Setup

### 6.1 MongoDB Atlas Configuration

1. **Create account** at https://cloud.mongodb.com
2. **Create cluster** → Shared (M0 free) or Dedicated (M10 for production)
3. **Select region** → `aws/ap-south-1` (Mumbai) for lowest Indian latency
4. **Create database user:**
   - Username: `moksh_prod_user`
   - Password: Generate a strong 32-char password
   - Role: `readWrite` on `moksh-foundation`
5. **Network Access:**
   - Add your Droplet's static IP
   - Or add `0.0.0.0/0` temporarily (restrict later)
6. **Get connection string:**
   ```
   mongodb+srv://moksh_prod_user:<password>@cluster0.xxxxx.mongodb.net/moksh-foundation?retryWrites=true&w=majority
   ```
7. **Update** `.env.backend` on your server with this URI.

### 6.2 Migrate Local Data to Atlas

```bash
# On your development machine, export the local database
mongodump --uri="mongodb://localhost:27017/moksh-foundation" --out=./backup

# Import into Atlas
mongorestore --uri="mongodb+srv://moksh_prod_user:<password>@cluster0.xxxxx.mongodb.net" --db moksh-foundation ./backup/moksh-foundation
```

### 6.3 Atlas Monitoring

Enable the following in Atlas dashboard:

- **Alerts:** Disk usage > 80%, connections > 100, replication lag > 10s
- **Profiler:** Slow queries > 100ms
- **Backup:** Daily automated snapshots with 7-day retention

---

## 7. Automated Deployment

### 7.1 GitHub Actions: Deploy on Push

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  workflow_run:
    workflows: ["Docker Publish"]
    types:
      - completed

jobs:
  deploy:
    runs-on: ubuntu-latest
    if: ${{ github.event.workflow_run.conclusion == 'success' }}

    steps:
    - name: Deploy to Server via SSH
      uses: appleboy/ssh-action@v1
      with:
        host: ${{ secrets.SERVER_HOST }}
        username: ${{ secrets.SERVER_USER }}
        key: ${{ secrets.SERVER_SSH_KEY }}
        script: |
          cd /opt/moksh-foundation
          echo "${{ secrets.GHCR_TOKEN }}" | docker login ghcr.io -u somil71 --password-stdin
          docker compose pull
          docker compose up -d --remove-orphans
          docker image prune -f
          echo "Deployed at $(date)"
```

### 7.2 Required GitHub Secrets

Set these in your repo → Settings → Secrets → Actions:

| Secret | Value |
|---|---|
| `SERVER_HOST` | Your Droplet IP (e.g. `143.110.xxx.xxx`) |
| `SERVER_USER` | `deploy` |
| `SERVER_SSH_KEY` | Contents of `~/.ssh/id_ed25519` (private key) |
| `GHCR_TOKEN` | GitHub PAT with `read:packages` scope |

### 7.3 Zero-Downtime Strategy

Docker Compose handles this naturally because:
- `docker compose pull` downloads new images in the background
- `docker compose up -d` recreates only changed containers
- `restart: always` + healthchecks ensure the new container is healthy before serving

For true blue-green deployments at scale, see Section 10 (Kubernetes).

---

## 8. Security Hardening

### 8.1 Firewall Rules (Recap)

```bash
sudo ufw status
# Should show: 22, 80, 443 ALLOW. Everything else DENY.
```

### 8.2 Docker Security

```bash
# Containers run as non-root (verify)
docker exec moksh-backend whoami   # Should be 'node' not 'root'

# Docker socket is not exposed
ls -la /var/run/docker.sock       # Owned by root:docker only
```

### 8.3 Environment Variables

- **Never** commit `.env.backend` to Git
- Store secrets in GitHub Actions Secrets
- Rotate JWT_SECRET every 90 days
- Use different secrets for staging vs production

### 8.4 Nginx Hardening

Already configured in the Nginx block above:
- `X-Frame-Options`: Prevents clickjacking
- `X-Content-Type-Options`: Prevents MIME sniffing
- `X-XSS-Protection`: XSS filter
- `Referrer-Policy`: Controls referrer leakage
- `Permissions-Policy`: Disables camera/mic/geolocation access
- `Strict-Transport-Security`: Forces HTTPS (added by Certbot)

### 8.5 Automatic Security Updates

```bash
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure --priority=low unattended-upgrades
# Select "Yes" to enable automatic security updates
```

---

## 9. Observability

### 9.1 Logging

```bash
# View live logs
docker compose logs -f --tail=100

# Save logs to file rotation
docker compose logs --no-color > /var/log/moksh/app-$(date +%F).log

# Setup logrotate for Docker logs
sudo tee /etc/logrotate.d/docker-containers > /dev/null <<'EOF'
/var/lib/docker/containers/*/*.log {
    rotate 7
    daily
    compress
    missingok
    delaycompress
    copytruncate
}
EOF
```

### 9.2 Monitoring with Uptime Kuma (Self-Hosted)

```bash
# Run Uptime Kuma alongside your app
docker run -d \
  --name uptime-kuma \
  --restart always \
  -p 127.0.0.1:3001:3001 \
  -v uptime-kuma:/app/data \
  louislam/uptime-kuma:1

# Add Nginx proxy block for monitoring.moksh.org
# Monitor endpoints:
#   https://moksh.org/              → Frontend health
#   https://moksh.org/api/health    → Backend health
#   MongoDB Atlas                   → Atlas built-in monitoring
```

### 9.3 Error Tracking with Sentry (Free Tier)

1. Create account at https://sentry.io
2. Create a Node.js project
3. Install in backend:
   ```bash
   npm install @sentry/node
   ```
4. Initialize in `src/index.ts` before other middleware:
   ```typescript
   import * as Sentry from '@sentry/node';
   Sentry.init({ dsn: 'https://xxx@sentry.io/xxx' });
   app.use(Sentry.Handlers.requestHandler());
   // ... routes ...
   app.use(Sentry.Handlers.errorHandler());
   ```

### 9.4 Server Metrics

```bash
# Quick CLI monitoring
htop                  # CPU/Memory
df -h                 # Disk usage
docker stats          # Per-container resource usage

# Cron job for disk alerts
echo '0 */6 * * * root df -h / | awk "NR==2{if(\$5+0 > 85) print \"DISK WARNING: \"\$5}" | mail -s "Disk Alert" admin@moksh.org' | sudo tee /etc/cron.d/disk-alert
```

---

## 10. Scaling Strategy

### 10.1 Vertical Scaling (Immediate)

Resize your DigitalOcean Droplet:
- **4 vCPU / 8 GB RAM** for moderate traffic (< 10K daily users)
- **8 vCPU / 16 GB RAM** for high traffic

### 10.2 Horizontal Scaling (Growth Phase)

```
                    ┌─────────────────┐
                    │  Load Balancer  │
                    │  (DO/Nginx)     │
                    └──┬──────────┬───┘
                       │          │
              ┌────────▼──┐  ┌───▼────────┐
              │ Server 1  │  │ Server 2   │
              │ Backend   │  │ Backend    │
              │ Frontend  │  │ Frontend   │
              └─────┬─────┘  └─────┬──────┘
                    │              │
              ┌─────▼──────────────▼──────┐
              │    MongoDB Atlas (M10+)   │
              │    Shared by all servers  │
              └───────────────────────────┘
```

Steps:
1. Clone your Droplet or create a second one
2. Use DigitalOcean Load Balancer ($12/mo) to distribute traffic
3. Move session storage to Redis (shared between servers)
4. MongoDB Atlas handles multiple connections natively

### 10.3 Kubernetes Migration Path (Enterprise Scale)

When you outgrow Docker Compose:

1. **DigitalOcean Kubernetes (DOKS):** Managed K8s starting at $12/mo
2. Convert `docker-compose.yml` → Kubernetes manifests using `kompose convert`
3. Use Helm charts for standardized deployments
4. Enable Horizontal Pod Autoscaler (HPA) for automatic scaling
5. Use Ingress Controller (nginx-ingress) to replace standalone Nginx

---

## Quick Reference: Day-1 Deployment Checklist

```
□ Create DigitalOcean Droplet (Ubuntu 22.04, 2 vCPU/4GB)
□ Run server provisioning (Section 3)
□ Create MongoDB Atlas cluster (Section 6)
□ Create /opt/moksh-foundation with docker-compose.yml and .env.backend
□ Pull and start containers (Section 4.5)
□ Point domain DNS to Droplet IP (Section 5.1)
□ Configure Nginx and obtain SSL certificate (Section 5.2-5.3)
□ Add GitHub Secrets and create deploy.yml (Section 7)
□ Push a test commit and verify auto-deployment
□ Set up Uptime Kuma monitoring (Section 9.2)
```
