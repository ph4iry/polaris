import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";
import pdfParse from "pdf-parse";
import path from "node:path";
import fs from "node:fs/promises";

// Configure OpenAI
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const config = {
  api: { bodyParser: false },
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    // Extract text from PDF
    const pdfData = await pdfParse(fileBuffer);
    const extractedText = pdfData.text;

    if (!extractedText) {
      return NextResponse.json({ error: "No text found in PDF" }, { status: 400 });
    }

    // Send text to ChatGPT
    const chatResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: `take this information and put it into this format:
        [
  {
    "name": "John Doe",
    "schedule": [
      {
        "location": "MB103",
        "teacher": "Mrs. Smith",
        "contactInfo": "smith@example.com",
        "startTime": "2025-03-08T08:00:00",
        "endTime": "2025-03-08T09:00:00"
      }
    ]
  },
  ... etc
      ]
  ${extractedText.slice(0, 3000)}
  return ONLY the json NO ADDITIONAL INFORMATION, NO SENTENCES, ONLY JSON. DO NOT SAY "HERE'S AN EXAMPLE OF HOW YOU COULD FORMAT THIS. ONLY PUT IN THE FIELDS SPECIFIED ABOVE. MAKE SURE ALL FIELDS ARE FILLED. do multiple students with the format above. no newlines."` }], // Truncate text for token limit
      max_tokens: 1000,
    });

    const jsonString = chatResponse.choices[0]?.message?.content;

    const filePath = path.join(process.cwd(), "students.json"); // Path in the current directory

    try {
      await fs.writeFile(filePath, jsonString!, "utf8");
      console.log("JSON saved to students.json");
    } catch (error) {
      console.error("Error writing file:", error);
    }
    
    return NextResponse.json({ response: chatResponse.choices[0]?.message?.content || "No response" });
  } catch (error) {
    console.error("Error processing file:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
