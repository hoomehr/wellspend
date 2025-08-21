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
        dataSource: dataSource as any,
        category,
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
        rawData: row,
        processedData: processDataRow(row, category),
        amount: extractAmount(row),
        date: extractDate(row),
        category: category,
        description: extractDescription(row),
        tags: generateTags(row, category)
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

      // TODO: Generate metrics from processed data
      await generateMetricsFromData(dataRecords, category)

      return NextResponse.json({
        message: "File uploaded and processed successfully",
        uploadId: uploadRecord.id,
        recordsProcessed: dataRecords.length
      })

    } catch (processingError) {
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
  const fieldMappings = {
    'amount': ['amount', 'cost', 'price', 'total', 'value'],
    'date': ['date', 'timestamp', 'created_at', 'time'],
    'description': ['description', 'summary', 'title', 'name']
  }

  for (const [standardField, variations] of Object.entries(fieldMappings)) {
    for (const variation of variations) {
      if (row[variation] && !processed[standardField]) {
        processed[standardField] = row[variation]
        break
      }
    }
  }

  return processed
}

function extractAmount(row: any): number | null {
  const amountFields = ['amount', 'cost', 'price', 'total', 'value']
  for (const field of amountFields) {
    if (row[field]) {
      const amount = parseFloat(String(row[field]).replace(/[^0-9.-]/g, ''))
      if (!isNaN(amount)) return amount
    }
  }
  return null
}

function extractDate(row: any): Date | null {
  const dateFields = ['date', 'timestamp', 'created_at', 'time']
  for (const field of dateFields) {
    if (row[field]) {
      const date = new Date(row[field])
      if (!isNaN(date.getTime())) return date
    }
  }
  return null
}

function extractDescription(row: any): string | null {
  const descFields = ['description', 'summary', 'title', 'name']
  for (const field of descFields) {
    if (row[field]) return String(row[field])
  }
  return null
}

function generateTags(row: any, category: string): string[] {
  const tags = [category]
  
  // Add tags based on content
  if (row.department) tags.push(`dept:${row.department}`)
  if (row.team) tags.push(`team:${row.team}`)
  if (row.project) tags.push(`project:${row.project}`)
  if (row.status) tags.push(`status:${row.status}`)
  
  return tags
}

async function generateMetricsFromData(dataRecords: any[], category: string) {
  // TODO: Implement metric generation logic
  // This would analyze the uploaded data and create/update metrics
  console.log(`Generating metrics for ${dataRecords.length} records in category: ${category}`)
} 