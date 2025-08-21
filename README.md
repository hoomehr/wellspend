# Wellspend - Privacy-First Cost & Efficiency Optimization Platform

Wellspend is a self-hosted platform for cost optimization and efficiency tracking that prioritizes data privacy by keeping all your financial, HR, productivity, and cloud billing data within your own infrastructure.

## 🔐 Privacy-First Architecture

- **All data stays local** - No external API calls to vendor servers
- **Self-hosted deployment** - Runs on your private domains or infrastructure
- **Customer-controlled integrations** - Only connect to services you approve
- **Encrypted data storage** - Sensitive fields encrypted at rest
- **Full data ownership** - Complete control over your business metrics

## ✨ Features

### MVP Features
- 🔐 **Secure Authentication** - Role-based access (Admin, Finance, Ops)
- 📊 **Comprehensive Dashboard** - Aggregated spending and productivity metrics
- 📈 **Interactive Charts** - Cost breakdowns and productivity trends
- 📤 **Data Upload** - CSV/JSON import for various data sources
- 🤖 **Smart Recommendations** - AI-powered cost optimization suggestions
- 🔌 **Local Integrations** - Secure connectors for Jira, Notion, AWS Billing

### Dashboard Metrics
- Monthly spending aggregation from multiple sources
- Cloud infrastructure cost breakdown
- Team productivity scores and task completion rates
- Trend analysis and historical comparisons
- Custom recommendation engine

## 🛠 Tech Stack

- **Framework**: Next.js 14 with TypeScript
- **UI**: TailwindCSS + shadcn/ui components
- **Charts**: Recharts for data visualization
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with local credential storage
- **File Storage**: Local filesystem (or S3-compatible storage)
- **Deployment**: Docker Compose for containerized deployment

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development)
- PostgreSQL (or use the provided Docker setup)

### 1. Clone and Setup
```bash
git clone <your-repo>
cd wellspend
cp .env.example .env.local
```

### 2. Configure Environment
Edit `.env.local` with your settings:
```env
DATABASE_URL="postgresql://wellspend:password@localhost:5432/wellspend"
NEXTAUTH_SECRET="your-secure-secret-key"
```

### 3. Deploy with Docker
```bash
# Start the full stack
docker-compose up -d

# Or with MinIO for object storage
docker-compose --profile storage up -d
```

### 4. Development Setup
```bash
# Install dependencies
npm install

# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Seed initial data
npm run db:seed

# Start development server
npm run dev
```

## 📦 Deployment Options

### Docker Compose (Recommended)
The easiest way to deploy Wellspend is using Docker Compose:

```bash
# Production deployment
docker-compose up -d
```

This includes:
- Next.js application server
- PostgreSQL database
- Optional MinIO for S3-compatible storage
- Persistent data volumes
- Health checks

### Manual Deployment
For custom deployments:

1. Set up PostgreSQL database
2. Configure environment variables
3. Build and run the Next.js application
4. Set up reverse proxy (nginx/traefik) for HTTPS

## 🔧 Configuration

### Database
Wellspend uses PostgreSQL for data storage. The schema includes:
- Users and authentication
- Uploaded data and processing records
- Metrics and recommendations
- Integration configurations
- Audit logs

### Integrations
Configure integrations by adding API credentials to `.env.local`:

```env
# Jira Integration
JIRA_API_TOKEN="your-jira-token"
JIRA_BASE_URL="https://your-company.atlassian.net"
JIRA_EMAIL="your-email@company.com"

# Notion Integration
NOTION_API_TOKEN="your-notion-integration-token"

# AWS Billing
AWS_ACCESS_KEY_ID="your-aws-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret"
AWS_REGION="us-east-1"
```

### Security
- All API routes require authentication
- Sensitive database fields are encrypted
- HTTPS/TLS termination recommended
- Role-based access control
- Session management with secure cookies

## 📊 Data Sources

Wellspend supports multiple data input methods:

### CSV/JSON Upload
- Billing data from various providers
- HR and payroll exports
- Project management tool exports
- Custom financial data

### API Integrations
- **Jira**: Task completion, team velocity, sprint metrics
- **Notion**: Documentation coverage, collaboration metrics
- **AWS Billing**: Cloud infrastructure costs and usage
- **Custom APIs**: Extensible connector framework

### Supported File Formats
- CSV files with headers
- JSON arrays or objects
- Automatic field mapping and data normalization

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ Basic dashboard and authentication
- ✅ CSV/JSON data upload
- ✅ Mock integrations and recommendations
- ✅ Docker deployment setup

### Phase 2
- [ ] Real API integrations (Jira, Notion, AWS)
- [ ] Advanced chart types and filtering
- [ ] Custom dashboard configuration
- [ ] Data export functionality

### Phase 3
- [ ] AI-powered cost optimization
- [ ] Automated data sync scheduling
- [ ] Multi-tenant support
- [ ] Advanced security features

## 🛡 Security Considerations

### Data Privacy
- No data transmission to external vendors
- All processing happens within your infrastructure
- Configurable data retention policies
- GDPR/compliance-friendly architecture

### Access Control
- Role-based permissions (Admin, Finance, Ops)
- Session-based authentication
- Secure password hashing (bcrypt)
- API endpoint protection

### Infrastructure Security
- Container-based deployment
- Environment variable configuration
- Database connection encryption
- HTTPS/TLS support

## 🤝 Contributing

Wellspend is designed to be extensible and customizable:

### Adding New Integrations
1. Create a new connector in `connectors/`
2. Implement the standard connector interface
3. Add configuration options
4. Update the integration management UI

### Custom Metrics
1. Define new metric types in the database schema
2. Create processing logic for your data sources
3. Add visualization components
4. Update the dashboard configuration

## 📄 License

[Add your license information here]

## 🆘 Support

For issues, questions, or contributions:
- Check the GitHub Issues
- Review the documentation
- Contact your system administrator

---

**Built with privacy in mind. Your data, your infrastructure, your control.** 