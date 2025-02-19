// app/api/columns/route.ts
import { NextRequest, NextResponse } from "next/server"
import path from "path"
import fs from "fs/promises"

export const dynamic = "force-dynamic"
export const maxDuration = 30

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const filename = searchParams.get("filename")

  if (!filename) {
    return NextResponse.json({ error: "No filename provided" }, { status: 400 })
  }

  try {
    const filePath = path.join(process.cwd(), "data", filename)
    
    // Read the JSON file
    const fileContents = await fs.readFile(filePath, 'utf-8')
    const data = JSON.parse(fileContents)

    // Determine column types with improved type checking
    const columns = Object.keys(data[0] || {}).map(name => ({
      name,
      isNumeric: data.every((row: Record<string, unknown>) => 
        row[name] === undefined || 
        (typeof row[name] === 'number' || !isNaN(Number(row[name])))
      )
    }))

    // Get first 5 rows for preview
    const preview = data.slice(0, 5)

    return NextResponse.json({ 
      columns, 
      preview,
      totalRows: data.length
    })
  } catch (error) {
    console.error("Error reading file:", error)
    
    // Differentiate between file not found and other errors
    if (error instanceof Error && 'code' in error && (error as NodeJS.ErrnoException).code === 'ENOENT') {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    return NextResponse.json({ 
      error: "Error reading file", 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 })
  }
}