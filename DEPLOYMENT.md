# Wellspend Deployment Guide

This guide covers both development setup and production deployment options for Wellspend.

## 📋 Prerequisites

### Development
- Node.js 18+ 
- npm or yarn
- Git

### Production
- Docker and Docker Compose (recommended)
- PostgreSQL database
- Reverse proxy (nginx/traefik) for HTTPS
- Domain name with SSL certificate

## 🚀 Development Setup

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd wellspend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create `.env.local` file:
```env
# Database (SQLite for development)
DATABASE_URL="file:./dev.db"

# NextAuth.js
NEXTAUTH_SECRET="your-super-secret-development-key"
NEXTAUTH_URL="http://localhost:3000"

# File Storage
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE="10485760"

# Optional: Integration API Keys for testing
JIRA_API_TOKEN=""
JIRA_BASE_URL=""
JIRA_EMAIL=""
NOTION_API_TOKEN=""
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
AWS_REGION=""
```

### 4. Database Setup
```bash
# Generate Prisma client
npm run db:generate

# Create database and tables
npm run db:push

# Seed with sample data
npm run db:seed
```

### 5. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` and login with:
- **Email**: `admin@wellspend.local`
- **Password**: `admin123`

## 🐳 Production Deployment

### Option 1: Docker Compose (Recommended)

#### 1. Clone and Configure
```bash
git clone <your-repo-url>
cd wellspend
cp .env.example .env.local
```

#### 2. Update Environment Variables
Edit `.env.local` for production:
```env
# Database (PostgreSQL for production)
DATABASE_URL="postgresql://wellspend:${DB_PASSWORD}@db:5432/wellspend?schema=public"

# Security
NEXTAUTH_SECRET="your-super-secure-production-secret-64-chars-long"
NEXTAUTH_URL="https://your-domain.com"

# Database password for Docker Compose
DB_PASSWORD="your-secure-database-password"

# Application
NODE_ENV="production"
APP_URL="https://your-domain.com"

# Integration API Keys
JIRA_API_TOKEN="your-jira-token"
JIRA_BASE_URL="https://your-company.atlassian.net"
JIRA_EMAIL="your-email@company.com"
NOTION_API_TOKEN="your-notion-token"
AWS_ACCESS_KEY_ID="your-aws-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret"
AWS_REGION="us-east-1"
```

#### 3. Deploy
```bash
# Start all services
docker-compose up -d

# With MinIO for file storage
docker-compose --profile storage up -d

# Check status
docker-compose ps
docker-compose logs app
```

#### 4. Initial Setup
```bash
# Access the application container
docker-compose exec app sh

# Run database migrations
npx prisma db push

# Seed initial data
npm run db:seed
```

### Option 2: Manual Deployment

#### 1. Database Setup
Set up PostgreSQL and create database:
```sql
CREATE DATABASE wellspend;
CREATE USER wellspend WITH PASSWORD 'your-password';
GRANT ALL PRIVILEGES ON DATABASE wellspend TO wellspend;
```

#### 2. Application Build
```bash
# Install dependencies
npm ci --only=production

# Update schema for PostgreSQL
# Edit prisma/schema.prisma: change provider to "postgresql"

# Generate Prisma client
npm run db:generate

# Build application
npm run build

# Run migrations
npm run db:push

# Seed data
npm run db:seed
```

#### 3. Process Management
Use PM2 or systemd to manage the Node.js process:

**PM2:**
```bash
npm install -g pm2
pm2 start ecosystem.config.js
pm2 startup
pm2 save
```

**ecosystem.config.js:**
```javascript
module.exports = {
  apps: [{
    name: 'wellspend',
    script: 'npm',
    args: 'start',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
```

#### 4. Reverse Proxy
Configure nginx:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🔧 Configuration

### Database Migration (SQLite to PostgreSQL)

For production, update `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Change string fields back to proper types:
// Float -> Decimal @db.Decimal(12, 2) for currency
// String -> Json for JSON fields
// String -> String[] for arrays
```

### Environment Variables

**Required:**
- `DATABASE_URL` - Database connection string
- `NEXTAUTH_SECRET` - Secret for JWT signing (64+ characters)
- `NEXTAUTH_URL` - Public URL of your application

**Optional:**
- `UPLOAD_DIR` - File upload directory (default: ./uploads)
- `MAX_FILE_SIZE` - Max upload size in bytes (default: 10MB)
- Integration API keys (Jira, Notion, AWS)

### File Storage Options

**Local Filesystem (Default):**
```env
UPLOAD_DIR="./uploads"
```

**S3-Compatible Storage:**
```env
S3_ENDPOINT="https://your-minio-endpoint"
S3_BUCKET="wellspend-uploads"
S3_ACCESS_KEY="your-access-key"
S3_SECRET_KEY="your-secret-key"
```

## 🔐 Security Checklist

### Application Security
- [ ] Strong `NEXTAUTH_SECRET` (64+ random characters)
- [ ] Secure database passwords
- [ ] HTTPS/TLS termination
- [ ] Regular security updates
- [ ] File upload restrictions

### Infrastructure Security
- [ ] Firewall configuration
- [ ] Database access restrictions
- [ ] Container security scanning
- [ ] Log monitoring
- [ ] Backup strategy

### Data Privacy
- [ ] Audit data retention policies
- [ ] Encryption at rest configuration
- [ ] Access logging enabled
- [ ] GDPR compliance review

## 📊 Monitoring

### Health Checks
The application provides health check endpoints:
- `GET /api/health` - Application status
- `GET /api/health/db` - Database connectivity

### Logging
Application logs are written to stdout/stderr and can be collected by:
- Docker logs: `docker-compose logs -f app`
- PM2 logs: `pm2 logs wellspend`
- System logs: `/var/log/wellspend/`

### Metrics
Monitor these key metrics:
- Application response time
- Database connection pool
- File upload success rate
- Integration sync status
- User authentication attempts

## 🔄 Backup and Recovery

### Database Backup
**PostgreSQL:**
```bash
# Backup
docker-compose exec db pg_dump -U wellspend wellspend > backup.sql

# Restore
docker-compose exec -T db psql -U wellspend wellspend < backup.sql
```

**SQLite:**
```bash
# Backup
cp dev.db backup-$(date +%Y%m%d-%H%M%S).db

# Restore
cp backup-20231201-143000.db dev.db
```

### File Storage Backup
```bash
# Local uploads
tar -czf uploads-backup-$(date +%Y%m%d).tar.gz uploads/

# S3/MinIO
aws s3 sync s3://wellspend-uploads/ ./uploads-backup/
```

## 🆘 Troubleshooting

### Common Issues

**Database Connection Errors:**
- Check `DATABASE_URL` format
- Verify database server is running
- Confirm firewall/network access

**Authentication Issues:**
- Verify `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches your domain
- Clear browser cookies/localStorage

**File Upload Failures:**
- Check `UPLOAD_DIR` permissions
- Verify `MAX_FILE_SIZE` setting
- Monitor disk space

**Integration Sync Errors:**
- Validate API credentials
- Check integration service status
- Review error logs

### Log Analysis
```bash
# Application logs
docker-compose logs -f app

# Database logs
docker-compose logs -f db

# All services
docker-compose logs -f

# Filter by error level
docker-compose logs app 2>&1 | grep ERROR
```

---

**Need help?** Check the main README.md or create an issue in the repository. 