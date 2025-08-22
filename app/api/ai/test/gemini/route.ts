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

    // Test Gemini connection
    const testResult = await testGeminiConnection(apiKey, model || 'gemini-1.5-pro')

    if (testResult.success) {
      return NextResponse.json({ 
        success: true, 
        message: "Gemini connection successful",
        model: testResult.model
      })
    } else {
      return NextResponse.json({ 
        error: testResult.error || "Gemini connection failed" 
      }, { status: 400 })
    }

  } catch (error) {
    console.error('Gemini test error:', error)
    return NextResponse.json(
      { error: "Internal server error during Gemini test" },
      { status: 500 }
    )
  }
}

async function testGeminiConnection(apiKey: string, model: string = 'gemini-1.5-pro') {
  try {
    // Test with a simple generation request
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: 'Hello'
          }]
        }],
        generationConfig: {
          maxOutputTokens: 5
        }
      })
    })

    if (response.ok) {
      const result = await response.json()
      if (result.candidates && result.candidates.length > 0) {
        return {
          success: true,
          model: model
        }
      } else {
        return {
          success: false,
          error: 'No response generated - API key may be invalid'
        }
      }
    } else {
      const error = await response.json()
      return {
        success: false,
        error: error.error?.message || 'Invalid API key or configuration'
      }
    }

  } catch (error) {
    console.error('Gemini connection test failed:', error)
    return {
      success: false,
      error: 'Network error or invalid API endpoint'
    }
  }
}
