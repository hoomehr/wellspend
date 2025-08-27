import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create demo user
  const hashedPassword = await bcrypt.hash('demo123456', 12)
  
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@wellspend.com' },
    update: {},
    create: {
      email: 'demo@wellspend.com',
      name: 'Demo User',
      password: hashedPassword,
      role: 'ADMIN',
      isActive: true,
    },
  })

  console.log('✅ Demo user created:', demoUser.email)

  // Create sample uploaded data
  const sampleUpload = await prisma.uploadedData.create({
    data: {
      fileName: 'sample-costs.csv',
      originalName: 'sample-costs.csv',
      fileSize: 2048,
      mimeType: 'text/csv',
      dataSource: 'CSV_UPLOAD',
      category: 'cloud-costs',
      uploadedBy: demoUser.id,
      isProcessed: true,
      processedAt: new Date(),
      metadata: JSON.stringify({
        columns: ['date', 'service', 'amount', 'category'],
        rowCount: 10
      })
    }
  })

  console.log('✅ Sample upload created:', sampleUpload.fileName)

  // Create sample data records
  const sampleData = [
    { date: '2024-01-01', service: 'AWS EC2', amount: 1250.50, category: 'compute', description: 'EC2 instances' },
    { date: '2024-01-01', service: 'AWS S3', amount: 89.25, category: 'storage', description: 'S3 storage' },
    { date: '2024-01-01', service: 'AWS RDS', amount: 445.75, category: 'database', description: 'RDS instances' },
    { date: '2024-02-01', service: 'AWS EC2', amount: 1189.30, category: 'compute', description: 'EC2 instances' },
    { date: '2024-02-01', service: 'AWS S3', amount: 92.40, category: 'storage', description: 'S3 storage' },
    { date: '2024-02-01', service: 'AWS RDS', amount: 428.90, category: 'database', description: 'RDS instances' },
    { date: '2024-03-01', service: 'AWS EC2', amount: 1098.75, category: 'compute', description: 'EC2 instances' },
    { date: '2024-03-01', service: 'AWS S3', amount: 78.60, category: 'storage', description: 'S3 storage' },
    { date: '2024-03-01', service: 'AWS RDS', amount: 402.15, category: 'database', description: 'RDS instances' },
    { date: '2024-04-01', service: 'GitHub Pro', amount: 48.00, category: 'tools', description: 'GitHub subscription' },
  ]

  for (const [index, record] of sampleData.entries()) {
    await prisma.dataRecord.create({
      data: {
        uploadId: sampleUpload.id,
        recordIndex: index,
        rawData: JSON.stringify(record),
        processedData: JSON.stringify(record),
        amount: record.amount,
        date: new Date(record.date),
        category: record.category,
        description: record.description,
        tags: `${record.service},${record.category}`,
      }
    })
  }

  console.log('✅ Sample data records created')

  // Create sample metrics
  await prisma.metric.createMany({
    data: [
      {
        name: 'total_monthly_cost',
        type: 'COST',
        value: 4123.85,
        unit: 'USD',
        period: '2024-03',
        category: 'cloud-costs',
        subcategory: 'aws',
        metadata: JSON.stringify({ breakdown: { compute: 1098.75, storage: 78.60, database: 402.15 }})
      },
      {
        name: 'productivity_score',
        type: 'PRODUCTIVITY',
        value: 85.5,
        unit: 'percent',
        period: '2024-03',
        category: 'team-metrics',
        metadata: JSON.stringify({ tasksCompleted: 142, tasksCreated: 167 })
      },
      {
        name: 'task_completion_rate',
        type: 'EFFICIENCY',
        value: 89.2,
        unit: 'percent',
        period: '2024-03',
        category: 'productivity',
        metadata: JSON.stringify({ onTime: 127, total: 142 })
      }
    ]
  })

  console.log('✅ Sample metrics created')

  // Create sample recommendations
  await prisma.recommendation.createMany({
    data: [
      {
        title: 'Optimize EC2 Instance Types',
        description: 'Switch from m5.large to m5.medium instances for development environments. Could save 30% on compute costs.',
        category: 'cost-optimization',
        priority: 'high',
        potentialSavings: 375.00,
        estimatedEffort: '2 hours',
        actionItems: JSON.stringify([
          'Review current EC2 usage patterns',
          'Identify development instances',
          'Schedule downtime for instance type changes',
          'Monitor performance after changes'
        ]),
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        metadata: JSON.stringify({ 
          affectedResources: ['i-1234567890abcdef0', 'i-0987654321fedcba0'],
          currentCost: 1250.50,
          projectedCost: 875.35
        })
      },
      {
        title: 'Enable S3 Intelligent Tiering',
        description: 'Automatically move infrequently accessed objects to cheaper storage classes.',
        category: 'cost-optimization',
        priority: 'medium',
        potentialSavings: 25.50,
        estimatedEffort: '1 hour',
        actionItems: JSON.stringify([
          'Review S3 bucket access patterns',
          'Enable Intelligent Tiering on appropriate buckets',
          'Set up monitoring for cost changes'
        ]),
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
        metadata: JSON.stringify({ 
          affectedBuckets: ['wellspend-uploads', 'wellspend-backups'],
          currentMonthlyCost: 89.25,
          projectedSavings: '20-30%'
        })
      },
      {
        title: 'Implement Daily Standups',
        description: 'Team productivity analysis shows irregular task completion patterns. Daily standups could improve coordination.',
        category: 'productivity',
        priority: 'medium',
        potentialSavings: null,
        estimatedEffort: '30 minutes daily',
        actionItems: JSON.stringify([
          'Schedule daily 15-minute standup meetings',
          'Create standardized agenda template',
          'Track blockers and dependencies',
          'Measure impact on task completion rates'
        ]),
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
        metadata: JSON.stringify({ 
          currentProductivityScore: 85.5,
          targetImprovement: '10-15%',
          teamSize: 8
        })
      }
    ]
  })

  console.log('✅ Sample recommendations created')

  console.log('🎉 Database seeding completed successfully!')
  console.log('\n📋 Demo Credentials:')
  console.log('Email: demo@wellspend.com')
  console.log('Password: demo123456')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Seeding failed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })