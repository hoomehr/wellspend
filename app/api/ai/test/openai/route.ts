import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { apiKey, organization, model } = await req.json()

    if (!apiKey) {
      return NextResponse.json({ error: "API key is required" }, { status: 400 })
    }

    // Test OpenAI connection
    const testResult = await testOpenAIConnection(apiKey, organization, model || 'gpt-3.5-turbo')

    if (testResult.success) {
      return NextResponse.json({ 
        success: true, 
        message: "OpenAI connection successful",
        model: testResult.model
      })
    } else {
      return NextResponse.json({ 
        error: testResult.error || "OpenAI connection failed" 
      }, { status: 400 })
    }

  } catch (error) {
    console.error('OpenAI test error:', error)
    return NextResponse.json(
      { error: "Internal server error during OpenAI test" },
      { status: 500 }
    )
  }
}

async function testOpenAIConnection(apiKey: string, organization?: string, model: string = 'gpt-3.5-turbo') {
  try {
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    }

    if (organization) {
      headers['OpenAI-Organization'] = organization
    }

    // Test with a simple completion
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: model,
        messages: [{ role: 'user', content: 'Hello' }],
        max_tokens: 5
      })
    })

    if (response.ok) {
      const result = await response.json()
      return {
        success: true,
        model: result.model || model
      }
    } else {
      const error = await response.json()
      return {
        success: false,
        error: error.error?.message || 'Invalid API key or configuration'
      }
    }

  } catch (error) {
    console.error('OpenAI connection test failed:', error)
    return {
      success: false,
      error: 'Network error or invalid API endpoint'
    }
  }
}
