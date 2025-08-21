import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { type, config } = await req.json()

    // Validate integration type
    const supportedTypes = ['jira', 'aws', 'notion', 'github']
    if (!supportedTypes.includes(type)) {
      return NextResponse.json({ error: "Unsupported integration type" }, { status: 400 })
    }

    // Test connection based on integration type
    let testResult = false
    let errorMessage = ""

    switch (type) {
      case 'jira':
        testResult = await testJiraConnection(config)
        break
      case 'aws':
        testResult = await testAwsConnection(config)
        break
      case 'notion':
        testResult = await testNotionConnection(config)
        break
      case 'github':
        testResult = await testGithubConnection(config)
        break
      default:
        return NextResponse.json({ error: "Invalid integration type" }, { status: 400 })
    }

    if (testResult) {
      return NextResponse.json({ 
        success: true, 
        message: "Connection successful" 
      })
    } else {
      return NextResponse.json({ 
        error: "Connection failed. Please check your credentials." 
      }, { status: 400 })
    }

  } catch (error) {
    console.error('Integration test error:', error)
    return NextResponse.json(
      { error: "Internal server error during connection test" },
      { status: 500 }
    )
  }
}

async function testJiraConnection(config: any): Promise<boolean> {
  try {
    const { url, email, apiToken } = config
    
    if (!url || !email || !apiToken) {
      return false
    }

    // Create basic auth header
    const auth = Buffer.from(`${email}:${apiToken}`).toString('base64')
    
    // Test connection by fetching user info
    const response = await fetch(`${url}/rest/api/3/myself`, {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json',
      },
    })

    return response.ok
  } catch (error) {
    console.error('Jira connection test failed:', error)
    return false
  }
}

async function testAwsConnection(config: any): Promise<boolean> {
  try {
    const { accessKeyId, secretAccessKey, region } = config
    
    if (!accessKeyId || !secretAccessKey || !region) {
      return false
    }

    // This is a simplified test - in a real implementation you would
    // use the AWS SDK to test the credentials
    // For now, we'll just validate the format
    const accessKeyRegex = /^AKIA[0-9A-Z]{16}$/
    const isValidFormat = accessKeyRegex.test(accessKeyId) && 
                         secretAccessKey.length >= 40 &&
                         region.length > 0

    return isValidFormat
  } catch (error) {
    console.error('AWS connection test failed:', error)
    return false
  }
}

async function testNotionConnection(config: any): Promise<boolean> {
  try {
    const { apiToken, databaseId } = config
    
    if (!apiToken || !databaseId) {
      return false
    }

    // Test Notion API connection
    const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}`, {
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
    })

    return response.ok
  } catch (error) {
    console.error('Notion connection test failed:', error)
    return false
  }
}

async function testGithubConnection(config: any): Promise<boolean> {
  try {
    const { token, organization } = config
    
    if (!token) {
      return false
    }

    // Test GitHub API connection
    const response = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    })

    return response.ok
  } catch (error) {
    console.error('GitHub connection test failed:', error)
    return false
  }
}
