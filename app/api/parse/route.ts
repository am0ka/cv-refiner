import { NextRequest, NextResponse } from "next/server";

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
  const dataUrl = `data:application/pdf;base64,${base64Pdf}`;

  try {
    const apiKey = process.env.OR_KEY;
    const model = process.env.OR_MODEL || "google/gemini-2.0-flash-exp:free";

    if (!apiKey) {
      console.error("Missing OR_KEY environment variable");
      throw new Error("Server configuration error");
    }

    const payload = {
      model: model,
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that extracts information from resumes/CVs. Your task is to verify if the document is a resume/CV, and if so, extract the candidate's full profile. Return the result strictly as a valid JSON object with the following structure:\n" +
            "{\n" +
            "  \"isResume\": boolean,\n" +
            "  \"validityReason\": string | null,\n" +
            "  \"firstName\": string | null,\n" +
            "  \"lastName\": string | null,\n" +
            "  \"email\": string | null,\n" +
            "  \"phone\": string | null,\n" +
            "  \"linkedin\": string | null,\n" +
            "  \"summary\": string | null,\n" +
            "  \"experiences\": [\n" +
            "    {\n" +
            "      \"company\": string,\n" +
            "      \"role\": string,\n" +
            "      \"startDate\": string,\n" +
            "      \"endDate\": string,\n" +
            "      \"description\": string[] (array of bullet points),\n" +
            "      \"summary\": string | null\n" +
            "    }\n" +
            "  ],\n" +
            "  \"education\": [\n" +
            "    {\n" +
            "      \"institution\": string,\n" +
            "      \"degree\": string,\n" +
            "      \"startDate\": string,\n" +
            "      \"endDate\": string\n" +
            "    }\n" +
            "  ],\n" +

            "  \"skills\": string[],\n" +
            "  \"languages\": string[]\n" +
            "}\n" +
            "Do not include markdown formatting or code blocks in the response, just the raw JSON.",
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Extract the full candidate profile from this resume."
            },
            {
              type: "file",
              file: {
                file_data: dataUrl,
                mime_type: "application/pdf"
              }
            }
          ],
        },
      ],
      plugins: [
        {
          id: "file-parser",
          pdf: {
            engine: "pdf-text",
          },
        },
      ],
    };

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey} `,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("OpenRouter API Error:", response.status, errText);
      throw new Error(`OpenRouter API failed with status ${response.status} `);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content?.trim();

    if (!content) {
      throw new Error("Empty response from LLM");
    }

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

    if (parsedResult.isResume === false) {
      return NextResponse.json(
        { error: parsedResult.validityReason || "The uploaded file does not appear to be a resume/CV." },
        { status: 400 }
      );
    }

    return NextResponse.json(parsedResult);

  } catch (error) {
    console.error("PDF Parse Error:", error);
    return NextResponse.json(
      { error: "Failed to parse PDF file" },
      { status: 500 }
    );
  }
}
