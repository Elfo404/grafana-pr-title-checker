import { getInput } from "@actions/core";
import { getOctokit } from "@actions/github";

const myToken = getInput("GITHUB_TOKEN");

export const octokit = getOctokit(myToken);
