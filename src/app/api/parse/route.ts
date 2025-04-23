import { NextRequest, NextResponse } from "next/server";
import { processCVWithLLM } from "../common";

// POST /api/parse to parse provided by formdata PDF file and extract name and email
export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64Pdf = buffer.toString("base64");

  try {
    if (!process.env.OR_KEY) {
      console.error("Missing OR_KEY environment variable");
      throw new Error("Server configuration error");
    }

    const response = await processCVWithLLM(base64Pdf);

    if (!response.ok) {
      const errText = await response.text();
      console.error("OpenRouter API Error:", response.status, errText);
      throw new Error(`OpenRouter API failed with status ${response.status} `);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content?.trim();

    if (!content) throw new Error("Empty response from LLM");

    console.log("LLM Response:", content);

    // clean up potential markdown code blocks if the model ignores the system prompt
    const cleanedContent = content.replace(/```json/g, "").replace(/```/g, "").trim();

    let parsedResult;
    try {
      parsedResult = JSON.parse(cleanedContent);
    } catch {
      console.error("Failed to parse LLM response as JSON", content);
      throw new Error("Invalid JSON response from LLM");
    }

    // Upload to Supabase Storage
    let filePath = null;
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

      if (supabaseUrl && supabaseKey) {
        const { createClient } = await import("@supabase/supabase-js");
        const supabase = createClient(supabaseUrl, supabaseKey);

        const fileName = `original/${crypto.randomUUID()}.pdf`;
        const { error: uploadError } = await supabase.storage
          .from('cv')
          .upload(fileName, buffer, {
            contentType: 'application/pdf',
            upsert: false
          });

        if (uploadError) {
          console.error("Supabase Storage Upload Error:", uploadError);
        } else {
          filePath = fileName;
        }
      }
    } catch (uploadErr) {
      console.error("Failed to upload to Supabase:", uploadErr);
    }

    if (parsedResult.isResume === false) {
      return NextResponse.json(
        { error: parsedResult.validityReason || "The uploaded file does not appear to be a resume/CV." },
        { status: 400 }
      );
    }

    return NextResponse.json({ ...parsedResult, filePath });

  } catch (error) {
    console.error("PDF Parse Error:", error);
    return NextResponse.json(
      { error: "Failed to parse PDF file" },
      { status: 500 }
    );
  }
}
