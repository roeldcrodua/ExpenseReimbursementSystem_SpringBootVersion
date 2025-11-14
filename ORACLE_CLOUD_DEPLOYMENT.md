# Oracle Cloud Deployment Guide

This guide will help you deploy your Expense Reimbursement System (upgraded to Java 21) to Oracle Cloud Infrastructure (OCI).

## 📋 Prerequisites

- Oracle Cloud account (Always Free tier is sufficient)
- Docker Desktop installed on your local machine
- Git installed

## 🎯 Deployment Options

### Option 1: Using Oracle Container Registry + Compute Instance (Recommended)
### Option 2: Using Oracle Cloud Shell + Compute Instance (Easiest)

---

## 🚀 Option 1: Deploy Using Docker Container Registry

### Step 1: Set Up Oracle Container Registry (OCIR)

1. **Login to Oracle Cloud Console** (https://cloud.oracle.com)

2. **Get your tenancy information:**
   - Go to: Profile → Tenancy: `<your-tenancy-name>`
   - Note your **Tenancy Namespace** (e.g., `axabcdef1234`)
   - Note your **Region** (e.g., `us-ashburn-1` = `iad`)

3. **Create Auth Token:**
   - Profile → User Settings → Auth Tokens → Generate Token
   - Name: `OCIR-Token`
   - **Copy and save the token immediately** (you won't see it again)

4. **Login to OCIR from your local machine:**
   ```powershell
   # Format: <region-key>.ocir.io
   # Username: <tenancy-namespace>/<your-username>
   # Password: <auth-token>
   
   docker login iad.ocir.io
   # Enter username: axabcdef1234/oracleidentitycloudservice/your.email@example.com
   # Enter password: <your-auth-token>
   ```

### Step 2: Build and Push Docker Image

1. **Update the deployment script:**
   - Edit `deploy-oracle-cloud.ps1`
   - Replace `<your-region>` with your region (e.g., `iad`, `phx`, `fra`)
   - Replace `<your-tenancy-namespace>` with your actual namespace

2. **Build and push:**
   ```powershell
   .\deploy-oracle-cloud.ps1
   ```

### Step 3: Create Compute Instance

1. **In Oracle Cloud Console:**
   - Navigation Menu → Compute → Instances → Create Instance

2. **Instance Configuration:**
   - **Name:** `ers-app-instance`
   - **Image:** Oracle Linux 8 (or Ubuntu 22.04)
   - **Shape:** VM.Standard.E2.1.Micro (Always Free)
   - **VCN:** Use default or create new
   - **SSH Key:** Upload your SSH public key or generate one

3. **Configure Network:**
   - VCN → Security Lists → Default Security List
   - Add Ingress Rule:
     - Source CIDR: `0.0.0.0/0`
     - Destination Port: `8080`
     - Description: `Spring Boot App`

### Step 4: Set Up PostgreSQL Database (Optional)

**Option A: Use Oracle Autonomous Database (Free Tier)**
1. Navigation Menu → Oracle Database → Autonomous Transaction Processing
2. Create Autonomous Database (Always Free)
3. Download wallet and note connection string

**Option B: Install PostgreSQL on Compute Instance**
```bash
sudo dnf install postgresql-server postgresql-contrib
sudo postgresql-setup --initdb
sudo systemctl enable postgresql
sudo systemctl start postgresql
```

### Step 5: Deploy Application on Compute Instance

1. **SSH into your instance:**
   ```powershell
   ssh -i <your-private-key> opc@<instance-public-ip>
   ```

2. **Install Docker:**
   ```bash
   sudo yum install -y docker
   sudo systemctl enable docker
   sudo systemctl start docker
   sudo usermod -aG docker opc
   # Logout and login again
   ```

3. **Login to OCIR from instance:**
   ```bash
   docker login iad.ocir.io
   ```

4. **Pull your application image:**
   ```bash
   docker pull iad.ocir.io/<namespace>/ers-springboot:latest
   ```

5. **Run the application:**
   ```bash
   # For H2 database (development/testing)
   docker run -d \
     -p 8080:8080 \
     -e SPRING_PROFILES_ACTIVE=prod \
     --name ers-app \
     --restart unless-stopped \
     iad.ocir.io/<namespace>/ers-springboot:latest
   
   # For PostgreSQL (production)
   docker run -d \
     -p 8080:8080 \
     -e SPRING_PROFILES_ACTIVE=prod \
     -e DATABASE_URL=jdbc:postgresql://localhost:5432/ersdb \
     -e DATABASE_USERNAME=ersuser \
     -e DATABASE_PASSWORD=YourSecurePassword123! \
     -e DATABASE_DRIVER=org.postgresql.Driver \
     -e DATABASE_DIALECT=org.hibernate.dialect.PostgreSQLDialect \
     --name ers-app \
     --restart unless-stopped \
     iad.ocir.io/<namespace>/ers-springboot:latest
   ```

6. **Configure firewall on the instance:**
   ```bash
   sudo firewall-cmd --permanent --add-port=8080/tcp
   sudo firewall-cmd --reload
   ```

7. **Test the application:**
   ```bash
   curl http://localhost:8080/ers/api/reimbursement
   ```

8. **Access from browser:**
   - `http://<instance-public-ip>:8080/ers/api/reimbursement`

---

## 🔧 Option 2: Quick Deploy Using Oracle Cloud Shell

### Step 1: Clone Your Repository

1. **Open Cloud Shell** (top right corner in Oracle Cloud Console)

2. **Clone your repository:**
   ```bash
   git clone https://github.com/<your-username>/ExpenseReimbursementSystem_SpringBootVersion.git
   cd ExpenseReimbursementSystem_SpringBootVersion
   ```

### Step 2: Build JAR File

```bash
# Set Java 21
export JAVA_HOME=/usr/lib/jvm/java-21-openjdk
export PATH=$JAVA_HOME/bin:$PATH

# Build
./mvnw clean package -DskipTests
```

### Step 3: Transfer to Compute Instance

```bash
# From Cloud Shell
scp -i ~/.ssh/<your-key> target/ers_springboot.jar opc@<instance-ip>:~/
```

### Step 4: Run on Compute Instance

```bash
# SSH to instance
ssh -i ~/.ssh/<your-key> opc@<instance-ip>

# Install Java 21
sudo dnf install java-21-openjdk java-21-openjdk-devel

# Run application
nohup java -jar ers_springboot.jar --spring.profiles.active=prod &

# Or use systemd service (recommended)
sudo nano /etc/systemd/system/ers-app.service
```

**systemd service file:**
```ini
[Unit]
Description=ERS Spring Boot Application
After=syslog.target network.target

[Service]
User=opc
ExecStart=/usr/bin/java -jar /home/opc/ers_springboot.jar --spring.profiles.active=prod
SuccessExitStatus=143
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable ers-app
sudo systemctl start ers-app
sudo systemctl status ers-app
```

---

## 🔒 Security Best Practices

1. **Use environment variables for secrets:**
   ```bash
   export DATABASE_PASSWORD="YourSecurePassword"
   ```

2. **Set up HTTPS with Let's Encrypt:**
   ```bash
   sudo dnf install certbot
   sudo certbot certonly --standalone -d yourdomain.com
   ```

3. **Use Oracle Cloud Vault for secrets management**

4. **Configure security groups properly:**
   - Only expose port 8080 (or 443 for HTTPS)
   - Restrict SSH access to your IP

---

## 📊 Monitoring & Logging

### View application logs:
```bash
# If using Docker
docker logs -f ers-app

# If using systemd
sudo journalctl -u ers-app -f
```

### Monitor resource usage:
```bash
# CPU and Memory
htop

# Docker stats
docker stats ers-app
```

---

## 🔄 Update/Redeploy Application

### Using Docker:
```bash
# Pull latest image
docker pull iad.ocir.io/<namespace>/ers-springboot:latest

# Stop and remove old container
docker stop ers-app
docker rm ers-app

# Run new container
docker run -d -p 8080:8080 --name ers-app <image>
```

### Using JAR file:
```bash
sudo systemctl stop ers-app
# Upload new JAR file
sudo systemctl start ers-app
```

---

## 🐛 Troubleshooting

### Application won't start:
```bash
# Check logs
docker logs ers-app

# Check if port is available
sudo netstat -tulpn | grep 8080

# Check database connectivity
curl http://localhost:8080/actuator/health
```

### Can't access from browser:
1. Check instance firewall: `sudo firewall-cmd --list-all`
2. Check OCI Security List ingress rules
3. Verify application is running: `docker ps` or `sudo systemctl status ers-app`

### Database connection issues:
- Verify DATABASE_URL environment variable
- Check database is running
- Verify credentials

---

## 📚 Additional Resources

- [Oracle Cloud Free Tier](https://www.oracle.com/cloud/free/)
- [Oracle Container Registry Documentation](https://docs.oracle.com/en-us/iaas/Content/Registry/home.htm)
- [Oracle Compute Documentation](https://docs.oracle.com/en-us/iaas/Content/Compute/home.htm)
- [Spring Boot in Production](https://docs.spring.io/spring-boot/docs/current/reference/html/deployment.html)

---

## ✅ Quick Checklist

- [ ] Oracle Cloud account created
- [ ] Auth token generated for OCIR
- [ ] Docker image built and pushed to OCIR
- [ ] Compute instance created (Always Free tier)
- [ ] Security list configured (port 8080 open)
- [ ] Docker installed on compute instance
- [ ] Application running on compute instance
- [ ] Database configured (H2 or PostgreSQL)
- [ ] Application accessible from public IP
- [ ] Firewall configured on instance

---

**Your application is now running on Java 21 in Oracle Cloud!** 🎉

For questions or issues, check the logs first:
```bash
docker logs ers-app -f
```
