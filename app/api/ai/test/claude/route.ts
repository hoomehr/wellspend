import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { apiKey, model } = await req.json()

    if (!apiKey) {
      return NextResponse.json({ error: "API key is required" }, { status: 400 })
    }

    // Test Claude connection
    const testResult = await testClaudeConnection(apiKey, model || 'claude-3-sonnet-20240229')

    if (testResult.success) {
      return NextResponse.json({ 
        success: true, 
        message: "Claude connection successful",
        model: testResult.model
      })
    } else {
      return NextResponse.json({ 
        error: testResult.error || "Claude connection failed" 
      }, { status: 400 })
    }

  } catch (error) {
    console.error('Claude test error:', error)
    return NextResponse.json(
      { error: "Internal server error during Claude test" },
      { status: 500 }
    )
  }
}

async function testClaudeConnection(apiKey: string, model: string = 'claude-3-sonnet-20240229') {
  try {
    const headers = {
      'x-api-key': apiKey,
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01'
    }

    // Test with a simple message
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: model,
        max_tokens: 5,
        messages: [{ role: 'user', content: 'Hello' }]
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
    console.error('Claude connection test failed:', error)
    return {
      success: false,
      error: 'Network error or invalid API endpoint'
    }
  }
}
