// app/api/result/route.ts
import { NextRequest, NextResponse } from "next/server"
import path from "path"
import fs from "fs/promises"

export const dynamic = "force-dynamic"
export const maxDuration = 30

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const filename = searchParams.get("filename")

  if (!filename) {
    return NextResponse.json({ error: "Invalid filename" }, { status: 400 })
  }

  try {
    const filePath = path.join(process.cwd(), "data", filename)
    
    // Read the JSON file
    const fileContents = await fs.readFile(filePath, 'utf-8')
    const data = JSON.parse(fileContents)

    // Determine numeric columns
    const numericColumns = Object.keys(data[0] || {}).filter(key => 
      data.every((row: any) => row[key] === undefined || !isNaN(Number(row[key])))
    )

    // Default equal weights
    const weights = numericColumns.reduce((acc: any, col) => {
      acc[col] = 1.0
      return acc
    }, {})

    // Check if result file already exists
    const resultFilename = `result_${filename}`
    const resultFilePath = path.join(process.cwd(), "data", resultFilename)

    try {
      // Try to read existing result file
      const resultContents = await fs.readFile(resultFilePath, 'utf-8')
      const existingResult = JSON.parse(resultContents)
      
      return NextResponse.json({
        result_data: existingResult.resultData,
        summary_data: existingResult.summaryData,
        kpi_columns: existingResult.kpiColumns,
      })
    } catch {
      // If no existing result, calculate on the fly
      const { calculatePriorityScore } = await import("@/lib/prioritizer")
      
      const { resultData, summaryData } = calculatePriorityScore(
        data, 
        numericColumns, 
        weights
      )

      // Save result for future use
      await fs.writeFile(
        resultFilePath, 
        JSON.stringify({ 
          resultData, 
          summaryData, 
          kpiColumns: numericColumns 
        }, null, 2)
      )

      return NextResponse.json({
        result_data: resultData,
        summary_data: summaryData,
        kpi_columns: numericColumns,
      })
    }
  } catch (error) {
    console.error("Error fetching results:", error)
    
    // Differentiate between file not found and other errors
    if (error instanceof Error && 'code' in error && (error as NodeJS.ErrnoException).code === 'ENOENT') {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    return NextResponse.json({ 
      error: "Error fetching results", 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 })
  }
}