#!/bin/bash
# ============================================================
# Moksh Sanskar Foundation — Server Provisioning Script
# Run as root on a fresh Ubuntu 22.04 server
# Usage: sudo bash provision-server.sh
# ============================================================

set -euo pipefail

echo "============================================"
echo "  Moksh Foundation — Server Provisioning"
echo "============================================"

# --- System Update ---
echo "[1/8] Updating system packages..."
apt update && apt upgrade -y

# --- Create deploy user ---
echo "[2/8] Creating deploy user..."
if ! id "deploy" &>/dev/null; then
    adduser --disabled-password --gecos "" deploy
    usermod -aG sudo deploy
    echo "deploy ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/deploy
    # Copy SSH keys from root so deploy user can SSH in
    mkdir -p /home/deploy/.ssh
    cp /root/.ssh/authorized_keys /home/deploy/.ssh/
    chown -R deploy:deploy /home/deploy/.ssh
    chmod 700 /home/deploy/.ssh
    chmod 600 /home/deploy/.ssh/authorized_keys
    echo "  ✓ Deploy user created"
else
    echo "  → Deploy user already exists"
fi

# --- SSH Hardening ---
echo "[3/8] Hardening SSH..."
sed -i 's/^#\?PermitRootLogin.*/PermitRootLogin no/' /etc/ssh/sshd_config
sed -i 's/^#\?PasswordAuthentication.*/PasswordAuthentication no/' /etc/ssh/sshd_config
systemctl restart sshd
echo "  ✓ Root login disabled, password auth disabled"

# --- Install Docker ---
echo "[4/8] Installing Docker..."
if ! command -v docker &>/dev/null; then
    curl -fsSL https://get.docker.com | sh
    usermod -aG docker deploy
    echo "  ✓ Docker installed"
else
    echo "  → Docker already installed: $(docker --version)"
fi

# --- Install Docker Compose plugin ---
echo "[5/8] Installing Docker Compose plugin..."
apt install -y docker-compose-plugin
echo "  ✓ Docker Compose: $(docker compose version)"

# --- Install Nginx ---
echo "[6/8] Installing Nginx..."
apt install -y nginx
systemctl enable nginx
echo "  ✓ Nginx installed and enabled"

# --- Firewall ---
echo "[7/8] Configuring UFW firewall..."
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable
echo "  ✓ Firewall active (22, 80, 443 open)"

# --- Security Extras ---
echo "[8/8] Installing security tools..."
apt install -y fail2ban unattended-upgrades certbot python3-certbot-nginx
systemctl enable fail2ban
systemctl start fail2ban
echo "  ✓ Fail2ban and auto-updates configured"

# --- Create app directory ---
mkdir -p /opt/moksh-foundation
chown deploy:deploy /opt/moksh-foundation

# --- Set timezone ---
timedatectl set-timezone Asia/Kolkata

echo ""
echo "============================================"
echo "  ✅ Server provisioning complete!"
echo ""
echo "  Next steps:"
echo "  1. SSH in as 'deploy' user"
echo "  2. cd /opt/moksh-foundation"
echo "  3. Create docker-compose.yml and .env.backend"
echo "  4. docker compose pull && docker compose up -d"
echo "============================================"
