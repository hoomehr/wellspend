import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { writeFile, mkdir } from "fs/promises"
import { existsSync } from "fs"
import path from "path"
import Papa from "papaparse"

const UPLOAD_DIR = process.env.UPLOAD_DIR || "./uploads"
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || "10485760") // 10MB

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get("file") as File
    const category = formData.get("category") as string
    const dataSource = formData.get("dataSource") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit` },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ["text/csv", "application/json", "text/plain"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only CSV and JSON files are allowed." },
        { status: 400 }
      )
    }

    // Create upload directory if it doesn't exist
    if (!existsSync(UPLOAD_DIR)) {
      await mkdir(UPLOAD_DIR, { recursive: true })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const fileName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    const filePath = path.join(UPLOAD_DIR, fileName)

    // Save file to disk
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Create upload record
    const uploadRecord = await db.uploadedData.create({
      data: {
        fileName,
        originalName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        dataSource: dataSource || 'CSV_UPLOAD',
        category: category || 'general',
        uploadedBy: session.user.id,
      }
    })

    // Process file content
    try {
      const fileContent = buffer.toString('utf-8')
      let parsedData: any[] = []

      if (file.type === "application/json") {
        parsedData = JSON.parse(fileContent)
        if (!Array.isArray(parsedData)) {
          parsedData = [parsedData]
        }
      } else if (file.type === "text/csv" || file.name.endsWith('.csv')) {
        const parseResult = Papa.parse(fileContent, {
          header: true,
          skipEmptyLines: true,
          transformHeader: (header) => header.trim()
        })
        parsedData = parseResult.data
      }

      // Create data records
      const dataRecords = parsedData.map((row, index) => ({
        uploadId: uploadRecord.id,
        recordIndex: index,
        rawData: JSON.stringify(row),
        processedData: JSON.stringify(processDataRow(row, category || 'general')),
        amount: extractAmount(row),
        date: extractDate(row),
        category: category || 'general',
        description: extractDescription(row),
        tags: generateTags(row, category || 'general')
      }))

      await db.dataRecord.createMany({
        data: dataRecords
      })

      // Update upload record as processed
      await db.uploadedData.update({
        where: { id: uploadRecord.id },
        data: {
          isProcessed: true,
          processedAt: new Date()
        }
      })

      // Generate metrics from processed data
      await generateMetricsFromData(dataRecords, category || 'general')

      return NextResponse.json({
        message: "File uploaded and processed successfully",
        uploadId: uploadRecord.id,
        recordsProcessed: dataRecords.length
      })

    } catch (processingError: any) {
      console.error("File processing error:", processingError)
      
      // Update upload record with error
      await db.uploadedData.update({
        where: { id: uploadRecord.id },
        data: {
          errorLog: processingError.message
        }
      })

      return NextResponse.json({
        message: "File uploaded but processing failed",
        uploadId: uploadRecord.id,
        error: processingError.message
      }, { status: 206 }) // Partial success
    }

  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// Helper functions for data processing
function processDataRow(row: any, category: string): any {
  // Normalize field names and values based on category
  const processed = { ...row }
  
  // Common field mappings
  const fieldMappings: { [key: string]: string[] } = {
    'amount': ['amount', 'cost', 'price', 'total', 'value', 'sum'],
    'date': ['date', 'created_at', 'timestamp', 'time', 'when'],
    'description': ['description', 'desc', 'name', 'title', 'label'],
    'category': ['category', 'type', 'kind', 'group', 'classification']
  }

  // Normalize field names
  Object.keys(fieldMappings).forEach(standardField => {
    const possibleFields = fieldMappings[standardField]
    for (const field of possibleFields) {
      if (row[field] && !processed[standardField]) {
        processed[standardField] = row[field]
        break
      }
    }
  })

  return processed
}

function extractAmount(row: any): number | null {
  const amountFields = ['amount', 'cost', 'price', 'total', 'value', 'sum']
  
  for (const field of amountFields) {
    if (row[field]) {
      const value = typeof row[field] === 'string' 
        ? parseFloat(row[field].replace(/[^0-9.-]/g, ''))
        : parseFloat(row[field])
      
      if (!isNaN(value)) return value
    }
  }
  
  return null
}

function extractDate(row: any): Date | null {
  const dateFields = ['date', 'created_at', 'timestamp', 'time', 'when']
  
  for (const field of dateFields) {
    if (row[field]) {
      const date = new Date(row[field])
      if (!isNaN(date.getTime())) return date
    }
  }
  
  return null
}

function extractDescription(row: any): string | null {
  const descFields = ['description', 'desc', 'name', 'title', 'label', 'service', 'item']
  
  for (const field of descFields) {
    if (row[field] && typeof row[field] === 'string') {
      return row[field].trim()
    }
  }
  
  return null
}

function generateTags(row: any, category: string): string {
  const tags = [category]
  
  // Add category-specific tags
  if (row.service) tags.push(row.service.toLowerCase())
  if (row.department) tags.push(row.department.toLowerCase())
  if (row.type) tags.push(row.type.toLowerCase())
  if (row.vendor) tags.push(row.vendor.toLowerCase())
  
  return tags.join(',')
}

async function generateMetricsFromData(dataRecords: any[], category: string): Promise<void> {
  try {
    // Calculate basic metrics from the uploaded data
    const currentDate = new Date()
    const currentMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`
    
    // Calculate total amount for this category
    const totalAmount = dataRecords.reduce((sum, record) => {
      return sum + (record.amount || 0)
    }, 0)

    if (totalAmount > 0) {
      // Update or create metric for this category
      await db.metric.upsert({
        where: {
          name_type_period_category: {
            name: `${category}_costs`,
            type: 'COST',
            period: currentMonth,
            category: category
          }
        },
        update: {
          value: totalAmount,
          calculatedAt: new Date()
        },
        create: {
          name: `${category}_costs`,
          type: 'COST',
          value: totalAmount,
          unit: 'USD',
          period: currentMonth,
          category: category,
          metadata: JSON.stringify({
            recordCount: dataRecords.length,
            source: 'upload'
          })
        }
      })

      console.log(`Generated metric for ${category}: $${totalAmount}`)
    }
  } catch (error) {
    console.error('Error generating metrics:', error)
  }
}