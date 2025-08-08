import { generateEmbedding } from "~/lib/gemini";
import { db } from "~/server/db";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { question, projectId } = await req.json();

  try {
    // Generate embedding
    const queryVector = await generateEmbedding(question);
    const vectorQuery = `[${queryVector.join(",")}]`;

    // Query database
    const results = await db.$queryRaw<{
      fileName: string;
      sourceCode: string;
      summary: string;
      similarity: number;
    }[]>`
      SELECT "fileName", "sourceCode", "summary",
        1 - ("summaryEmbedding" <=> ${vectorQuery}::vector) AS similarity
      FROM "SourceCodeEmbedding"
      WHERE 1 - ("summaryEmbedding" <=> ${vectorQuery}::vector) > 0.5
      ORDER BY similarity DESC
      LIMIT 10;
    `;

    // Build context
    let context = "";
    for (const doc of results) {
      context += `File: ${doc.fileName}\nSummary: ${doc.summary}\nCode: ${doc.sourceCode}\n\n`;
    }

    // Generate response using strict format
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
You are an AI code assistant who answers questions about the codebase. Your target audience is a technical intern who is new to the project.

AI assistant is a brand new, powerful, human-like artificial intelligence.
The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
AI is a well-behaved and well-mannered individual.
AI is always friendly, kind, and inspiring, and is eager to provide vivid and thoughtful responses to the user.
AI has the sum of all knowledge in their brain and is able to accurately answer nearly any question about any topic in the codebase.
If the question is asking about code or a specific file, AI will provide the detailed answer, giving step-by-step instructions when needed.

START CONTEXT BLOCK
${context}
END CONTEXT BLOCK

START QUESTION
${question}
END QUESTION

AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
If the context does not provide the answer to the question, the AI assistant will say, "I'm sorry, but I don't know the answer to that based on the provided information."
AI assistant will not explain or guess, but instead indicate new information would be required.
AI assistant will not invent anything that is not drawn directly from the context.
AI assistant will try to be as detailed as possible when generating responses.
    `.trim();

    const result = await model.generateContent(prompt);
    const text = (await result.response).text();
    console.log(results)
    
    return NextResponse.json({
      answer: text,
      sources: results.map(r => ({
        fileName: r.fileName,
        similarity: r.similarity,
        sourceCode:r.sourceCode
      }))
    });

  } catch (error) {
    console.error("Error in askQuestion API:", error);
    return NextResponse.json(
      { 
        answer: "I'm sorry, but I couldn't process your question due to a technical issue. Please try again later.",
        sources: [],
        error: String(error)
      },
      { status: 500 }
    );
  }
}