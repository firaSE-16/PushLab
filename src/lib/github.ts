import { Octokit } from "octokit";
import { db } from "~/server/db";
import axios from "axios";
import { summariseCommit } from "./gemini";

export const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

type Response = {
  commitHash: string;
  commitMessage: string;
  commitAuthorName: string;
  commitAuthorAvatar: string;
  commitDate: string;
};

export const getCommitHashes = async (githubUrl: string) => {
  try {
    const [owner, repo] = githubUrl.split("/").slice(-2);

    if (!owner || !repo) {
      throw new Error("Invalid GitHub URL");
    }

    const { data } = await octokit.rest.repos.listCommits({
      owner,
      repo,
    });

    const sortedCommits = data.sort(
      (a: any, b: any) =>
        new Date(b.commit.author.date).getTime() -
        new Date(a.commit.author.date).getTime()
    );

    return sortedCommits.slice(0, 10).map((commit: any) => ({
      commitHash: commit.sha as string,
      commitMessage: commit.commit.message ?? "",
      commitAuthorName: commit.commit?.author?.name ?? "",
      commitAuthorAvatar: commit?.author?.avatar_url ?? "",
      commitDate: commit.commit?.author?.date ?? "",
    }));
  } catch (error) {
    console.error("❌ Failed to fetch commit hashes:", error);
    return [];
  }
};

export const pollCommits = async (projectId: string) => {
  try {
    const { project, githubUrl: repoUrl } = await fetchProjectGithubUrl(projectId);

    const commitHashes = await getCommitHashes(repoUrl);
    if (commitHashes.length === 0) {
      console.warn(`⚠️ No commits found for project ${projectId}`);
      return;
    }

    const unprocessedCommits = await filterUnprocessedCommits(
      projectId,
      commitHashes
    );
    if (unprocessedCommits.length === 0) {
      return;
    }

    const summaryResponses = await Promise.allSettled(
      unprocessedCommits.map(async (commit) => {
        try {
          return await summariseCommits(repoUrl, commit.commitHash);
        } catch (err) {
          console.error(
            `❌ Failed to summarise commit ${commit.commitHash}:`,
            err
          );
          return "Summary unavailable";
        }
      })
    );

    const summaries = summaryResponses.map((response) =>
      response.status === "fulfilled" && typeof response.value === "string"
        ? response.value
        : "Summary unavailable"
    );


    const commitInsert = await db.commits.createMany({
      data: summaries.map((summary, index) => ({
        projectId,
        commitHash: unprocessedCommits[index]!.commitHash,
        commitMessage: unprocessedCommits[index]!.commitMessage,
        commitAuthorName: unprocessedCommits[index]!.commitAuthorName,
        CommitAuthorAvatar: unprocessedCommits[index]!.commitAuthorAvatar,
        CommitDate: new Date(unprocessedCommits[index]!.commitDate),
        Summary: summary,
      })),
      skipDuplicates: true,
    });

    return commitInsert;
  } catch (error) {
    console.error(`❌ pollCommits failed for project ${projectId}:`, error);
  }
};

async function summariseCommits(githubUrl: string, commitHash: string) {
  try {
    const { data } = await axios.get(`${githubUrl}/commit/${commitHash}.diff`, {
      headers: {
        Accept: "application/vnd.github.v3.diff",
      },
    });

    return await summariseCommit(data);
  } catch (error) {
    console.error(`❌ Failed to fetch diff for commit ${commitHash}:`, error);
    return "Summary unavailable";
  }
}

async function fetchProjectGithubUrl(projectId: string) {
  const project = await db.project.findUnique({
    where: { id: projectId },
    select: {
      repoUrl: true,
    },
  });

  if (!project?.repoUrl) {
    throw new Error("❌ Project has no GitHub URL");
  }
  return { project, githubUrl: project.repoUrl };
}

async function filterUnprocessedCommits(
  projectId: string,
  commitHashes: Response[]
) {
  try {
    const processedCommits = await db.commits.findMany({
      where: { projectId },
    });

    return commitHashes.filter(
      (commit) =>
        !processedCommits.some(
          (processedCommit) => processedCommit.commitHash === commit.commitHash
        )
    );
  } catch (error) {
    console.error("❌ Failed to filter unprocessed commits:", error);
    return commitHashes; // fallback to process all if query fails
  }
}
