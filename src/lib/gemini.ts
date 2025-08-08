import { GoogleGenerativeAI } from "@google/generative-ai";
import type { Document } from "@langchain/core/documents";
import "dotenv/config";
import { generate } from "node_modules/@langchain/core/dist/utils/fast-json-patch";

const ai = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function summariseCommit(commitDiff: string) {
  try {
    const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent(`
You are an expert software engineer. Summarize the following commit changes clearly and concisely:

- **Summary**: One sentence.
- **Details**: Bullet points.
- **Impact**: Effect on system.

Commit Diff:
\`\`\`diff
${commitDiff}
\`\`\`
    `);

    const summaryText = result?.response?.text?.();

    if (!summaryText || summaryText.trim() === "") {
      console.warn("⚠️ Gemini returned an empty summary");
      return "Summary unavailable (AI returned no text)";
    }

    console.log("✅ Gemini Summary:", summaryText);
    return summaryText;
  } catch (error) {
    console.error("❌ Failed to summarise commit with Gemini:", error);
    return "Summary unavailable (Gemini API error)";
  }
}

// Example test
summariseCommit(
  "diff --git a/index.js b/index.js\n+ console.log('Hello World!');"
);



export async function summariseCode(doc: Document) {
  try {
    console.log("📄 Getting summary for:", doc.metadata?.source);

    // Get Gemini model
    const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Limit content to avoid token overflow
    const code = doc.pageContent.slice(0, 10000); // Limit to 10k chars

    // Prepare prompt
    const prompt = `
You are an intelligent senior software engineer who specialises in onboarding junior software engineers onto projects.
You are explaining the purpose of the file **${doc.metadata?.source || "Unknown file"}** to a junior developer.

Here is the code:
\`\`\`
${code}
\`\`\`

---
**Task**: Provide a summary of no more than **100 words** that explains:
- What this file does  
- Any important functions, logic, or configurations  
- The overall purpose in the project
    `;

    // Call Gemini API
    const result = await model.generateContent(prompt);

    // Extract summary text
    const summaryText = result?.response?.text?.();

    if (!summaryText || summaryText.trim() === "") {
      console.warn("⚠️ Gemini returned an empty summary");
      return "Summary unavailable (AI returned no text)";
    }

    console.log("✅ Gemini Summary:", summaryText);
    return summaryText;
  } catch (error) {
    console.error("❌ Failed to summarise code with Gemini:", error);
    return "Summary unavailable (Gemini API error)";
  }
}


export async function generateEmbedding(summary:string){

    const model = ai.getGenerativeModel({
        model:"text-embedding-004"
    })
    const result = await model.embedContent(summary)

    const embedding = result.embedding
    return embedding.values
}