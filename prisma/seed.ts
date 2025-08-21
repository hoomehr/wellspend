import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create default admin user
  const hashedPassword = await bcrypt.hash('admin123', 12)
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@wellspend.local' },
    update: {},
    create: {
      email: 'admin@wellspend.local',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  console.log('Created admin user:', adminUser.email)

  // Create some initial integrations
  const integrations = [
    {
      name: 'jira',
      displayName: 'Jira Integration',
      isEnabled: false,
    },
    {
      name: 'notion',
      displayName: 'Notion Integration',
      isEnabled: false,
    },
    {
      name: 'aws-billing',
      displayName: 'AWS Billing Integration',
      isEnabled: false,
    },
  ]

  for (const integration of integrations) {
    await prisma.integration.upsert({
      where: { name: integration.name },
      update: {},
      create: integration,
    })
  }

  console.log('Created integrations')

  // Create some sample metrics for demo purposes
  const currentDate = new Date()
  const currentPeriod = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`
  
  const sampleMetrics = [
    {
      name: 'total_monthly_cost',
      type: 'COST',
      value: 45750,
      unit: 'USD',
      period: currentPeriod,
      category: 'total',
    },
    {
      name: 'cloud_infrastructure_cost',
      type: 'COST',
      value: 12500,
      unit: 'USD',
      period: currentPeriod,
      category: 'cloud-costs',
    },
    {
      name: 'hr_costs',
      type: 'COST',
      value: 28000,
      unit: 'USD',
      period: currentPeriod,
      category: 'hr-costs',
    },
    {
      name: 'productivity_score',
      type: 'PRODUCTIVITY',
      value: 87.5,
      unit: 'percent',
      period: currentPeriod,
      category: 'productivity',
    },
    {
      name: 'task_completion_rate',
      type: 'PRODUCTIVITY',
      value: 92.3,
      unit: 'percent',
      period: currentPeriod,
      category: 'productivity',
    },
  ]

  for (const metric of sampleMetrics) {
    await prisma.metric.upsert({
      where: { 
        name_type_period_category: {
          name: metric.name,
          type: metric.type,
          period: metric.period,
          category: metric.category || '',
        }
      },
      update: { value: metric.value },
      create: metric,
    })
  }

  console.log('Created sample metrics')
  console.log('Database seeded successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  }) 