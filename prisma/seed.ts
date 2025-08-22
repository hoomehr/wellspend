import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create default user
  const hashedPassword = await bcrypt.hash('password123', 12)
  const user = await prisma.user.upsert({
    where: { email: 'admin@wellspend.com' },
    update: {},
    create: {
      email: 'admin@wellspend.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
      isActive: true,
    }
  })

  console.log('👤 Created user:', user.email)

  // Create AI providers
  const aiProviders = [
    {
      name: 'wellspend',
      displayName: 'Wellspend AI (Pay-as-you-go)',
      isEnabled: true,
      usageLimit: 100.0,
      currentUsage: 15.30,
    },
    {
      name: 'openai',
      displayName: 'OpenAI GPT-4',
      isEnabled: false,
      usageLimit: 50.0,
      currentUsage: 0,
    },
    {
      name: 'claude',
      displayName: 'Anthropic Claude 3',
      isEnabled: false,
      usageLimit: 75.0,
      currentUsage: 0,
    },
    {
      name: 'gemini',
      displayName: 'Google Gemini Pro',
      isEnabled: false,
      usageLimit: 40.0,
      currentUsage: 0,
    }
  ]

  for (const provider of aiProviders) {
    await prisma.aiProvider.upsert({
      where: { name: provider.name },
      update: {},
      create: provider
    })
  }

  console.log('🤖 Created AI providers')

  // Create analytics techniques
  const techniques = [
    {
      name: 'cost_anomaly_detection',
      displayName: 'Cost Anomaly Detection',
      description: 'Identifies unusual spending patterns and cost spikes',
      category: 'cost',
      isEnabled: true,
      priority: 9,
      config: JSON.stringify({
        sensitivityThreshold: 0.2,
        lookbackPeriod: 30,
        alertThreshold: 0.15
      })
    },
    {
      name: 'predictive_trend_analysis',
      displayName: 'Predictive Trend Analysis',
      description: 'Forecasts future costs and productivity trends',
      category: 'cost',
      isEnabled: true,
      priority: 8,
      config: JSON.stringify({
        forecastPeriod: 90,
        confidenceInterval: 0.95,
        seasonalAdjustment: true
      })
    },
    {
      name: 'team_efficiency_scoring',
      displayName: 'Team Efficiency Scoring',
      description: 'Calculates and benchmarks team productivity metrics',
      category: 'productivity',
      isEnabled: true,
      priority: 7,
      config: JSON.stringify({
        scoringMethod: 'weighted_average',
        benchmarkSource: 'industry_standard',
        includeQuality: true
      })
    },
    {
      name: 'industry_benchmark_analysis',
      displayName: 'Industry Benchmark Analysis',
      description: 'Compares performance against industry standards',
      category: 'efficiency',
      isEnabled: false,
      priority: 6,
      config: JSON.stringify({
        industry: 'technology',
        companySize: 'medium',
        region: 'global'
      })
    },
    {
      name: 'resource_utilization_analysis',
      displayName: 'Resource Utilization Analysis',
      description: 'Analyzes resource usage efficiency and optimization opportunities',
      category: 'efficiency',
      isEnabled: true,
      priority: 7,
      config: JSON.stringify({
        resourceTypes: ['compute', 'storage', 'network'],
        utilizationThreshold: 0.7,
        optimizationSuggestions: true
      })
    },
    {
      name: 'team_behavior_analytics',
      displayName: 'Team Behavior Analytics',
      description: 'Analyzes collaboration patterns and workflow efficiency',
      category: 'productivity',
      isEnabled: false,
      priority: 5,
      config: JSON.stringify({
        collaborationMetrics: true,
        workflowAnalysis: true,
        communicationPatterns: true
      })
    },
    {
      name: 'roi_impact_analysis',
      displayName: 'ROI Impact Analysis',
      description: 'Measures return on investment for various initiatives',
      category: 'cost',
      isEnabled: true,
      priority: 8,
      config: JSON.stringify({
        timeHorizon: 12,
        riskAdjusted: true,
        includeOpportunityCost: true
      })
    },
    {
      name: 'quality_cost_correlation',
      displayName: 'Quality-Cost Correlation',
      description: 'Analyzes relationship between quality metrics and costs',
      category: 'efficiency',
      isEnabled: false,
      priority: 6,
      config: JSON.stringify({
        qualityMetrics: ['defect_rate', 'customer_satisfaction', 'rework_time'],
        correlationMethod: 'pearson',
        includeDelayedEffects: true
      })
    }
  ]

  for (const technique of techniques) {
    await prisma.analyticsTechnique.upsert({
      where: { name: technique.name },
      update: {},
      create: technique
    })
  }

  console.log('📊 Created analytics techniques')

  // Create sample metrics
  const currentDate = new Date()
  const currentMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`
  const lastMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth()).padStart(2, '0')}`

  const metrics = [
    // Current month metrics
    { name: 'total_monthly_cost', type: 'cost', value: 12450.50, unit: 'USD', period: currentMonth, category: 'overall' },
    { name: 'cloud_costs', type: 'cost', value: 4850.25, unit: 'USD', period: currentMonth, category: 'cloud' },
    { name: 'hr_costs', type: 'cost', value: 6200.00, unit: 'USD', period: currentMonth, category: 'hr' },
    { name: 'productivity_score', type: 'productivity', value: 87.5, unit: 'percent', period: currentMonth, category: 'overall' },
    { name: 'task_completion_rate', type: 'productivity', value: 92.3, unit: 'percent', period: currentMonth, category: 'tasks' },
    { name: 'aws_ec2_costs', type: 'cost', value: 2100.30, unit: 'USD', period: currentMonth, category: 'cloud', subcategory: 'aws-ec2' },
    { name: 'aws_s3_costs', type: 'cost', value: 450.20, unit: 'USD', period: currentMonth, category: 'cloud', subcategory: 'aws-s3' },
    
    // Last month metrics
    { name: 'total_monthly_cost', type: 'cost', value: 11890.75, unit: 'USD', period: lastMonth, category: 'overall' },
    { name: 'cloud_costs', type: 'cost', value: 4620.45, unit: 'USD', period: lastMonth, category: 'cloud' },
    { name: 'hr_costs', type: 'cost', value: 6100.00, unit: 'USD', period: lastMonth, category: 'hr' },
    { name: 'productivity_score', type: 'productivity', value: 84.2, unit: 'percent', period: lastMonth, category: 'overall' },
    { name: 'task_completion_rate', type: 'productivity', value: 89.7, unit: 'percent', period: lastMonth, category: 'tasks' },
  ]

  for (const metric of metrics) {
    await prisma.metric.upsert({
      where: {
        name_type_period_category: {
          name: metric.name,
          type: metric.type,
          period: metric.period,
          category: metric.category!
        }
      },
      update: {},
      create: metric
    })
  }

  console.log('📈 Created sample metrics')

  // Create sample recommendations
  const recommendations = [
    {
      title: 'Optimize EC2 Instance Types',
      description: 'Switch to more cost-effective instance types based on actual usage patterns. Analysis shows 23% of instances are oversized.',
      category: 'cost-optimization',
      priority: 'high',
      potentialSavings: 1250.50,
      estimatedEffort: '2-3 hours',
      actionItems: JSON.stringify([
        'Analyze current EC2 usage patterns',
        'Identify oversized instances',
        'Test performance with smaller instance types',
        'Implement gradual migration plan'
      ]),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      metadata: JSON.stringify({
        affectedInstances: 15,
        avgSavingsPerInstance: 83.37,
        riskLevel: 'low'
      })
    },
    {
      title: 'Implement Automated Task Prioritization',
      description: 'Deploy AI-powered task prioritization to improve team productivity by 15-20%.',
      category: 'productivity',
      priority: 'medium',
      potentialSavings: 2100.00,
      estimatedEffort: '1 week',
      actionItems: JSON.stringify([
        'Research task prioritization tools',
        'Define prioritization criteria',
        'Pilot with one team',
        'Roll out to all teams'
      ]),
      validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
      metadata: JSON.stringify({
        expectedProductivityGain: '15-20%',
        implementation: 'gradual',
        toolsRequired: ['Jira', 'AI Engine']
      })
    },
    {
      title: 'Consolidate Unused Software Licenses',
      description: 'Remove 12 unused software licenses identified across teams to reduce monthly software costs.',
      category: 'cost-optimization',
      priority: 'medium',
      potentialSavings: 450.00,
      estimatedEffort: '4 hours',
      actionItems: JSON.stringify([
        'Audit all software licenses',
        'Identify unused accounts',
        'Confirm with team leads',
        'Cancel unused subscriptions'
      ]),
      validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      metadata: JSON.stringify({
        unusedLicenses: 12,
        monthlySavings: 450.00,
        riskLevel: 'minimal'
      })
    },
    {
      title: 'Setup Automated Cost Alerts',
      description: 'Configure intelligent cost monitoring to prevent budget overruns and catch anomalies early.',
      category: 'monitoring',
      priority: 'high',
      potentialSavings: 0, // Preventive measure
      estimatedEffort: '2 hours',
      actionItems: JSON.stringify([
        'Define cost alert thresholds',
        'Setup email notifications',
        'Configure Slack integration',
        'Test alert system'
      ]),
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      metadata: JSON.stringify({
        alertTypes: ['threshold', 'anomaly', 'trend'],
        notificationChannels: ['email', 'slack'],
        preventiveMeasure: true
      })
    }
  ]

  for (const rec of recommendations) {
    await prisma.recommendation.create({
      data: rec
    })
  }

  console.log('💡 Created sample recommendations')

  // Create integrations
  const integrations = [
    {
      name: 'jira',
      displayName: 'Jira Project Management',
      isEnabled: true,
      syncFrequency: 'daily',
      lastSyncAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      nextSyncAt: new Date(Date.now() + 22 * 60 * 60 * 1000), // 22 hours from now
      config: JSON.stringify({
        serverUrl: 'https://company.atlassian.net',
        projectKeys: ['PROJ', 'DEV', 'OPS'],
        trackTimeSpent: true,
        includeSubtasks: true
      })
    },
    {
      name: 'aws-billing',
      displayName: 'AWS Cost and Billing',
      isEnabled: true,
      syncFrequency: 'daily',
      lastSyncAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
      nextSyncAt: new Date(Date.now() + 23 * 60 * 60 * 1000), // 23 hours from now
      config: JSON.stringify({
        regions: ['us-east-1', 'us-west-2'],
        services: ['EC2', 'S3', 'RDS', 'Lambda'],
        granularity: 'DAILY',
        includeTags: true
      })
    },
    {
      name: 'notion',
      displayName: 'Notion Workspace',
      isEnabled: false,
      syncFrequency: 'manual',
      config: JSON.stringify({
        workspaceId: '',
        databaseIds: [],
        includePages: true,
        trackEdits: false
      })
    },
    {
      name: 'github',
      displayName: 'GitHub Development',
      isEnabled: false,
      syncFrequency: 'manual',
      config: JSON.stringify({
        organizations: [],
        repositories: [],
        includeCommits: true,
        includePullRequests: true,
        trackCodeQuality: false
      })
    }
  ]

  for (const integration of integrations) {
    await prisma.integration.upsert({
      where: { name: integration.name },
      update: {},
      create: integration
    })
  }

  console.log('🔗 Created integrations')

  // Create dashboard widgets
  const widgets = [
    {
      name: 'total_costs',
      displayName: 'Total Monthly Costs',
      type: 'metric',
      position: 1,
      size: 'md',
      config: JSON.stringify({
        metricName: 'total_monthly_cost',
        displayFormat: 'currency',
        showTrend: true,
        trendPeriod: 3
      }),
      refreshRate: 300
    },
    {
      name: 'productivity_score',
      displayName: 'Team Productivity Score',
      type: 'metric',
      position: 2,
      size: 'md',
      config: JSON.stringify({
        metricName: 'productivity_score',
        displayFormat: 'percentage',
        showTarget: true,
        target: 85
      }),
      refreshRate: 600
    },
    {
      name: 'cost_breakdown_chart',
      displayName: 'Cost Breakdown',
      type: 'chart',
      position: 3,
      size: 'lg',
      config: JSON.stringify({
        chartType: 'pie',
        categories: ['cloud', 'hr', 'software', 'infrastructure'],
        timeRange: 'current_month'
      }),
      refreshRate: 900
    },
    {
      name: 'productivity_trends',
      displayName: 'Productivity Trends',
      type: 'chart',
      position: 4,
      size: 'lg',
      config: JSON.stringify({
        chartType: 'line',
        metrics: ['productivity_score', 'task_completion_rate'],
        timeRange: 'last_6_months'
      }),
      refreshRate: 900
    }
  ]

  for (const widget of widgets) {
    await prisma.dashboardWidget.upsert({
      where: { name: widget.name },
      update: {},
      create: widget
    })
  }

  console.log('📊 Created dashboard widgets')

  // Create sample uploaded data
  const uploadedFiles = [
    {
      fileName: `${Date.now()}-payroll_december_2023.csv`,
      originalName: 'payroll_december_2023.csv',
      fileSize: 2400000, // 2.4MB
      mimeType: 'text/csv',
      dataSource: 'CSV_UPLOAD',
      category: 'hr',
      uploadedBy: user.id,
      isProcessed: true,
      processedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      metadata: JSON.stringify({
        rows: 85,
        columns: ['employee_id', 'name', 'department', 'salary', 'benefits'],
        detectedCurrency: 'USD'
      })
    },
    {
      fileName: `${Date.now()}-quarterly_expenses_q4.csv`,
      originalName: 'quarterly_expenses_q4.xlsx',
      fileSize: 5100000, // 5.1MB
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      dataSource: 'CSV_UPLOAD',
      category: 'operating-costs',
      uploadedBy: user.id,
      isProcessed: true,
      processedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      metadata: JSON.stringify({
        rows: 342,
        columns: ['date', 'category', 'amount', 'vendor', 'description'],
        detectedCurrency: 'USD'
      })
    }
  ]

  for (const file of uploadedFiles) {
    await prisma.uploadedData.create({
      data: file
    })
  }

  console.log('📁 Created sample uploaded data')

  console.log('✅ Database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })