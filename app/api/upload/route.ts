// app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { IncomingForm } from "formidable";
import fs from "fs/promises";
import path from "path";
import { Readable } from "stream";
import * as XLSX from "xlsx";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  // Use the public/uploads directory (as indicated by the error path)
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  const dataDir = path.join(process.cwd(), "data");
  await fs.mkdir(uploadsDir, { recursive: true });
  await fs.mkdir(dataDir, { recursive: true });

  try {
    // Get the raw body as an ArrayBuffer and convert to Buffer
    const buf = Buffer.from(await req.arrayBuffer());

    // Create a Readable stream from the buffer
    const stream = Readable.from(buf);

    // Add headers and method to the stream so that formidable can access them
    Object.assign(stream, {
      headers: Object.fromEntries(req.headers),
      method: req.method,
    });

    // Initialize formidable form options
    const form = new IncomingForm({
      uploadDir: uploadsDir,
      keepExtensions: true,
      maxFileSize: 50 * 1024 * 1024, // 50 MB
    });

    // Parse the form using a promise
    const { files } = await new Promise<{ files: any }>((resolve, reject) => {
      form.parse(stream as any, (err, _fields, files) => {
        if (err) return reject(err);
        resolve({ files });
      });
    });

    // Handle file upload (assuming input field name is "file")
    const uploadedFile = Array.isArray(files.file) ? files.file[0] : files.file;

    if (!uploadedFile) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Ensure the file exists before attempting to read it
    await fs.access(uploadedFile.filepath);

    // Read the uploaded Excel file using XLSX
    const workbook = XLSX.readFile(uploadedFile.filepath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert worksheet to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    // Generate a unique filename for the JSON file
    const jsonFilename = `${Date.now()}_data.json`;
    const jsonFilePath = path.join(dataDir, jsonFilename);

    // Write the JSON to the file system
    await fs.writeFile(jsonFilePath, JSON.stringify(jsonData, null, 2));

    // Optionally, remove the temporary uploaded Excel file
    await fs.unlink(uploadedFile.filepath);

    const originalFilename = uploadedFile.originalFilename || "unknown";

    return NextResponse.json({
      filename: jsonFilename,
      originalFilename,
      size: jsonData.length,
      columns: Object.keys(jsonData[0] || {}),
    });
  } catch (error) {
    console.error("File upload and conversion error:", error);
    return NextResponse.json(
      {
        error: "File upload failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}