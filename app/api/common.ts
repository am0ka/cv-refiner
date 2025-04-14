const API_KEY_REF = process.env.OR_KEY;

export async function processCVWithLLM(base64Pdf: string) {
    const model = process.env.OR_MODEL || "google/gemini-2.0-flash-exp:free";
    const messages = [
        {
            role: "system",
            content: "You are a helpful assistant that extracts information from resumes/CVs. Your task is to verify if the document is a resume/CV, and if so, extract the candidate's full profile. Return the result strictly as a valid JSON object with the following structure:\n" +
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
                "Do not include markdown formatting or code blocks in the response, just the raw JSON."
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
                        file_data: `data:application/pdf;base64,${base64Pdf}`,
                        mime_type: "application/pdf"
                    }
                }
            ],
        },
    ];
    const plugins = [{ id: "file-parser", pdf: { engine: "pdf-text", } }];

    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: { Authorization: `Bearer ${API_KEY_REF}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ model, messages, plugins }),
        });

        return response;
    } catch (error) {
        console.error("OpenRouter request failed:", error);
        throw error;
    }
}

