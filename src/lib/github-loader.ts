import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github";
import type { Document } from "@langchain/core/documents";
import { db } from "~/server/db";
import { generateEmbedding, summariseCode } from "./gemini";


export const loadGithubRepo = async (
  githubUrl: string,
  githubToken?: string
) => {
  const loader = new GithubRepoLoader(githubUrl, {
    accessToken: githubToken || "",
    branch: "main",
    ignoreFiles: [
      "package-lock.json",
      "yarn.lock",
      "pnpm-lock.yaml",
      "bun.lockb",
    ],
    recursive: true,
    unknown: "warn",
    maxConcurrency: 5,
  });

  const docs = await loader.load();
  return docs;
};


export const indexGithubRepo = async (
  projectId: string,
  githubUrl: string,
  githubToken?: string
) => {
  try {
    const docs = await loadGithubRepo(githubUrl, githubToken);
    const allEmbeddings = await generateEmbeddings(docs);

    await Promise.allSettled(
      allEmbeddings.map(async (embedding, index) => {
        console.log(`Processing ${index + 1} of ${allEmbeddings.length}`);
        if (!embedding) return;

        const sourceCodeEmbedding = await db.sourceCodeEmbedding.create({
          data: {
            summary: embedding.summary,
            sourceCode: embedding.sourceCode,
            fileName: embedding.fileName,
            projectId,
          },
        });

        await db.$executeRaw`
          UPDATE "SourceCodeEmbedding"
          SET "summaryEmbedding" = ${embedding.embedding}::vector
          WHERE "id" = ${sourceCodeEmbedding.id}
        `;
      })
    );

    console.log("✅ GitHub repo indexed successfully");
  } catch (error) {
    console.error("❌ Failed to index GitHub repo:", error);
    throw error;
  }
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));


const generateEmbeddings = async (
  docs: Document[]
): Promise<
  Array<{
    summary: string;
    embedding: number[] | null;
    sourceCode: string;
    fileName: string;
  }>
> => {
  const results = [];

  for (const doc of docs) {
    try {
      const summary = await summariseCode(doc);
      await delay(6000); 

      const embedding = await generateEmbedding(summary);
      await delay(6000); 

      results.push({
        summary,
        embedding,
        sourceCode: doc.pageContent,
        fileName: doc.metadata.source || "unknown-file",
      });
    } catch (error) {
      console.error(`⚠️ Failed to process ${doc.metadata.source}:`, error);
      results.push({
        summary: "Summary unavailable",
        embedding: null,
        sourceCode: doc.pageContent,
        fileName: doc.metadata.source || "unknown-file",
      });
    }
  }

  return results;
};
