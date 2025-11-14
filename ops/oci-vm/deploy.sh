#!/usr/bin/env bash
set -euo pipefail

# Template deployment script for OCI VM
# Prereqs: ssh key access to VM, Java 21 available (this script can install on Oracle Linux/Ubuntu)

VM_HOST="your.vm.ip.or.dns"
VM_USER="opc"          # Oracle Linux default; use ubuntu for Ubuntu images
SSH_OPTS="-o StrictHostKeyChecking=no"

APP_USER="ers"
APP_DIR="/opt/ers/app"
ENV_DIR="/etc/ers"
JAR_LOCAL="target/ers_springboot.jar"
JAR_REMOTE="$APP_DIR/ers_springboot.jar"

# 1) Build locally (run from repo root before calling this script)
#   ./mvnw -DskipTests package

# 2) Prime VM (create user, dirs, install java, systemd unit)
ssh $SSH_OPTS ${VM_USER}@${VM_HOST} bash -s <<'REMOTE'
set -euo pipefail

# Detect distro
if [ -f /etc/oracle-release ] || [ -f /etc/redhat-release ]; then
  PKG=dnf
elif [ -f /etc/debian_version ]; then
  PKG=apt-get
else
  echo "Unsupported distro - install Java 21 manually" >&2
  exit 1
fi

# Install Java 21 and nginx
if [ "$(id -u)" -ne 0 ]; then
  SUDO=sudo
else
  SUDO=
fi
$SUDO $PKG update -y || true
if [ "${PKG}" = "dnf" ]; then
  $SUDO dnf install -y java-21-openjdk java-21-openjdk-devel nginx
else
  $SUDO apt-get install -y wget gnupg nginx
  # Install temurin JDK 21
  wget -qO- https://packages.adoptium.net/artifactory/api/gpg/key/public | $SUDO tee /etc/apt/trusted.gpg.d/adoptium.asc >/dev/null
  echo "deb [signed-by=/etc/apt/trusted.gpg.d/adoptium.asc] https://packages.adoptium.net/artifactory/deb $(. /etc/os-release; echo $VERSION_CODENAME) main" | $SUDO tee /etc/apt/sources.list.d/adoptium.list
  $SUDO apt-get update -y
  $SUDO apt-get install -y temurin-21-jdk
fi

# Create app user and dirs
if ! id -u ers >/dev/null 2>&1; then
  $SUDO useradd -r -m -d /opt/ers -s /sbin/nologin ers
fi
$SUDO mkdir -p /opt/ers/app
$SUDO mkdir -p /etc/ers
$SUDO chown -R ers:ers /opt/ers

# Install systemd unit
$SUDO tee /etc/systemd/system/ers.service >/dev/null <<'UNIT'
[Unit]
Description=ERS Spring Boot Service
After=network.target

[Service]
User=ers
Group=ers
WorkingDirectory=/opt/ers/app
EnvironmentFile=/etc/ers/ers.env
Environment="JAVA_OPTS=-Xms256m -Xmx1024m -XX:+UseG1GC -Duser.timezone=UTC"
ExecStart=/usr/bin/java $JAVA_OPTS -jar /opt/ers/app/ers_springboot.jar --spring.profiles.active=prod --server.port=${SERVER_PORT}
SuccessExitStatus=143
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
UNIT

# Nginx basic reverse proxy (HTTP only; add TLS later)
$SUDO tee /etc/nginx/conf.d/ers.conf >/dev/null <<'NGINX'
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass         http://127.0.0.1:8080/;
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_connect_timeout 60s;
        proxy_read_timeout 60s;
    }
}
NGINX

$SUDO systemctl enable nginx --now
REMOTE

# 3) Upload JAR and env file placeholder
scp $SSH_OPTS "$JAR_LOCAL" ${VM_USER}@${VM_HOST}:/tmp/ers_springboot.jar
ssh $SSH_OPTS ${VM_USER}@${VM_HOST} bash -s <<'REMOTE'
set -euo pipefail
if [ "$(id -u)" -ne 0 ]; then SUDO=sudo; else SUDO=; fi
$SUDO mv /tmp/ers_springboot.jar /opt/ers/app/ers_springboot.jar
$SUDO chown ers:ers /opt/ers/app/ers_springboot.jar

# Create env file if missing
if [ ! -f /etc/ers/ers.env ]; then
  $SUDO tee /etc/ers/ers.env >/dev/null <<'ENV'
DATABASE_URL=jdbc:postgresql://db-host:5432/ers
DATABASE_USERNAME=ers_user
DATABASE_PASSWORD=change_me
SERVER_PORT=8080
ENV
  $SUDO chmod 600 /etc/ers/ers.env
fi

$SUDO systemctl daemon-reload
$SUDO systemctl restart ers
$SUDO systemctl status --no-pager ers || true
$SUDO nginx -t && $SUDO systemctl reload nginx
REMOTE

cat <<NOTE
Deployment steps completed.
Next:
- SSH into the VM and edit /etc/ers/ers.env with real credentials
- Ensure OCI security list allows 80/443 (and 22)
- Optional: install certbot for TLS and redirect 80 -> 443
- Test: curl -I http://<VM_IP>/
NOTE
