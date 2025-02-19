// app/api/calculate/route.ts

import { NextRequest, NextResponse } from "next/server"
import path from "path"
import fs from "fs/promises"
import { calculatePriorityScore } from "@/lib/prioritizer"

export const dynamic = "force-dynamic"
export const maxDuration = 30

export async function POST(request: NextRequest) {
  const { filename, kpi_columns, weights } = await request.json()

  if (!filename || !kpi_columns || !weights) {
    return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
  }

  try {
    const filePath = path.join(process.cwd(), "data", filename)
    
    // Read the JSON file
    const fileContents = await fs.readFile(filePath, 'utf-8')
    const data = JSON.parse(fileContents)

    // Validate KPI columns exist in the data
    const invalidColumns = kpi_columns.filter((col:any) => 
      !Object.keys(data[0] || {}).includes(col)
    )

    if (invalidColumns.length > 0) {
      return NextResponse.json({ 
        error: "Invalid KPI columns", 
        invalidColumns 
      }, { status: 400 })
    }

    // Validate weights match KPI columns
    const missingWeights = kpi_columns.filter((col:any) => 
      weights[col] === undefined
    )

    if (missingWeights.length > 0) {
      return NextResponse.json({ 
        error: "Missing weights for some KPI columns", 
        missingColumns: missingWeights 
      }, { status: 400 })
    }

    // Calculate priority scores
    const { resultData, summaryData } = calculatePriorityScore(
      data, 
      kpi_columns, 
      weights
    )

    // Generate a unique result ID
    const resultId = `result_${Date.now()}`
    
    // Optionally, save results to a file for persistence
    const resultFilePath = path.join(process.cwd(), "data", `${resultId}.json`)
    await fs.writeFile(
      resultFilePath, 
      JSON.stringify({ resultData, summaryData, kpi_columns }, null, 2)
    )

    return NextResponse.json({ 
      id: resultId, 
      resultData, 
      summaryData, 
      kpi_columns 
    })
  } catch (error) {
    console.error("Error calculating priority scores:", error)
    
    // Differentiate between file not found and other errors
    if (error instanceof Error && 'code' in error && (error as NodeJS.ErrnoException).code === 'ENOENT') {
      return NextResponse.json({ error: "Source file not found" }, { status: 404 })
    }

    return NextResponse.json({ 
      error: "Error calculating priority scores", 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 })
  }
}