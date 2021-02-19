import { getInput } from "@actions/core";
import { octokit } from "./oktokit";
import { context } from "@actions/github";

export const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");
export const issue_number = parseInt(process.env.GITHUB_REF.split("/")[2]);

async function getJSON(repoPath) {
  const response = await octokit.repos.getContent({
    owner,
    repo,
    path: repoPath,
    ref: context.sha,
  });

  return JSON.parse(
    // @ts-ignore
    Buffer.from(response.data.content, response.data.encoding).toString()
  );
}

interface Config {
  checks?: {
    prefix?: string[];
  };
  includeLabels?: string[];
}

export const getConfig = async (): Promise<Config> =>
  JSON.parse(await getJSON(getInput("configuration-path")));
