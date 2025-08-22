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

    const { provider, config } = await req.json()

    // Validate provider type
    const supportedProviders = ['openai', 'claude', 'gemini', 'platform']
    if (!supportedProviders.includes(provider)) {
      return NextResponse.json({ error: "Unsupported AI provider" }, { status: 400 })
    }

    if (!config) {
      return NextResponse.json({ error: "Configuration is required" }, { status: 400 })
    }

    // Encrypt sensitive configuration data
    const encryptedConfig = encryptAiConfig(config)

    // Upsert AI integration record in database
    const aiIntegration = await db.aiIntegration.upsert({
      where: {
        userId_provider: {
          userId: session.user.id,
          provider: provider.toUpperCase()
        }
      },
      update: {
        config: encryptedConfig,
        isActive: true,
        updatedAt: new Date()
      },
      create: {
        userId: session.user.id,
        provider: provider.toUpperCase(),
        config: encryptedConfig,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      message: "AI integration configuration saved successfully",
      provider: aiIntegration.provider,
      isActive: aiIntegration.isActive
    })

  } catch (error: any) {
    console.error('AI configuration error:', error)
    
    return NextResponse.json(
      { error: "Failed to save AI configuration" },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get all AI integrations for the user
    const aiIntegrations = await db.aiIntegration.findMany({
      where: {
        userId: session.user.id
      },
      select: {
        provider: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
        // Don't select config for security
      }
    })

    return NextResponse.json({
      integrations: aiIntegrations
    })

  } catch (error) {
    console.error('AI configuration fetch error:', error)
    return NextResponse.json(
      { error: "Failed to fetch AI configurations" },
      { status: 500 }
    )
  }
}

function encryptAiConfig(config: any): string {
  try {
    // In a real implementation, you would encrypt sensitive data
    // For now, we'll just JSON stringify (DO NOT use this in production)
    // Consider using libraries like 'crypto' or dedicated encryption services
    
    // Remove sensitive fields from logging
    const sanitizedConfig = { ...config }
    if (sanitizedConfig.apiKey) sanitizedConfig.apiKey = "[ENCRYPTED]"
    
    console.log('Storing AI config:', sanitizedConfig)
    
    // In production, encrypt the actual config before storing
    return JSON.stringify(config)
  } catch (error) {
    console.error('AI config encryption failed:', error)
    throw new Error('Failed to encrypt AI configuration')
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const provider = searchParams.get('provider')

    if (!provider) {
      return NextResponse.json({ error: "Provider is required" }, { status: 400 })
    }

    // Delete AI integration
    await db.aiIntegration.delete({
      where: {
        userId_provider: {
          userId: session.user.id,
          provider: provider.toUpperCase()
        }
      }
    })

    return NextResponse.json({
      message: "AI integration deleted successfully"
    })

  } catch (error) {
    console.error('AI configuration deletion error:', error)
    return NextResponse.json(
      { error: "Failed to delete AI configuration" },
      { status: 500 }
    )
  }
}
