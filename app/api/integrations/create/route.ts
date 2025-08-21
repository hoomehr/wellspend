import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { type, config, name } = await req.json()

    // Validate integration type
    const supportedTypes = ['jira', 'aws', 'notion', 'github']
    if (!supportedTypes.includes(type)) {
      return NextResponse.json({ error: "Unsupported integration type" }, { status: 400 })
    }

    if (!name || !config) {
      return NextResponse.json({ error: "Name and config are required" }, { status: 400 })
    }

    // Encrypt sensitive configuration data
    const encryptedConfig = encryptConfig(config)

    // Create integration record in database
    const integration = await db.integration.create({
      data: {
        name,
        type: type.toUpperCase(),
        config: encryptedConfig,
        userId: session.user.id,
        status: 'ACTIVE',
        lastSync: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })

    // Schedule initial data sync (implement based on your needs)
    await scheduleInitialSync(integration.id, type, config)

    return NextResponse.json({
      message: "Integration created successfully",
      integrationId: integration.id,
      name: integration.name,
      type: integration.type
    })

  } catch (error: any) {
    console.error('Integration creation error:', error)
    
    // Handle unique constraint errors
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: "An integration with this name already exists" },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Failed to create integration" },
      { status: 500 }
    )
  }
}

function encryptConfig(config: any): string {
  try {
    // In a real implementation, you would encrypt sensitive data
    // For now, we'll just JSON stringify (DO NOT use this in production)
    // Consider using libraries like 'crypto' or dedicated encryption services
    
    // Remove sensitive fields from logging
    const sanitizedConfig = { ...config }
    if (sanitizedConfig.apiToken) sanitizedConfig.apiToken = "[ENCRYPTED]"
    if (sanitizedConfig.secretAccessKey) sanitizedConfig.secretAccessKey = "[ENCRYPTED]"
    if (sanitizedConfig.token) sanitizedConfig.token = "[ENCRYPTED]"
    
    console.log('Storing config for integration:', sanitizedConfig)
    
    // In production, encrypt the actual config before storing
    return JSON.stringify(config)
  } catch (error) {
    console.error('Config encryption failed:', error)
    throw new Error('Failed to encrypt configuration')
  }
}

async function scheduleInitialSync(integrationId: string, type: string, config: any) {
  try {
    // This would typically trigger a background job or webhook
    // to perform the initial data sync from the integration
    
    console.log(`Scheduling initial sync for integration ${integrationId} of type ${type}`)
    
    // Create a sync job record
    await db.syncJob.create({
      data: {
        integrationId,
        status: 'PENDING',
        scheduledAt: new Date(),
        type: 'INITIAL_SYNC'
      }
    })
    
    // In a real implementation, you might:
    // 1. Add to a job queue (Redis, Bull, etc.)
    // 2. Trigger a webhook
    // 3. Schedule with a cron service
    // 4. Use serverless functions
    
  } catch (error) {
    console.error('Failed to schedule initial sync:', error)
    // Don't fail the integration creation if sync scheduling fails
  }
}
