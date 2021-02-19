import * as core from "@actions/core";
import { context } from "@actions/github";
import { checkPhrasing } from "./checkPhrasing";
import { getConfig, issue_number, owner, repo } from "./config";
import { octokit } from "./oktokit";

// most @actions toolkit packages have async methods
async function run() {
  try {
    const title: string = context.payload.pull_request.title;
    const labels: string[] = context.payload.pull_request.labels;
    const config = await getConfig();

    // If the PR has a label we want to ignore we skip the checks.
    // if (
    //   config.ignoreLabels.filter((label) => labels.includes(label)).length > 0
    // ) {
    //   return;
    // }

    const r = checkPhrasing(title);
    console.log(r);

    if (r.errors.length > 0) {
      addComment(r.errors);
      core.setFailed("Failing CI test");
    }

    // LABEL.name = LABEL.name || "title needs formatting";
    // LABEL.color = LABEL.color || "eee";
    // CHECKS.ignoreLabels = CHECKS.ignoreLabels || [];
    // for (let i = 0; i < labels.length; i++) {
    //   for (let j = 0; j < CHECKS.ignoreLabels.length; j++) {
    //     if (labels[i].name == CHECKS.ignoreLabels[j]) {
    //       core.info("Ignoring Title Check for label - " + labels[i].name);
    //       return;
    //     }
    //   }
    // }
    // try {
    //   let createResponse = await octokit.issues.createLabel({
    //     owner,
    //     repo,
    //     name: LABEL.name,
    //     color: LABEL.color,
    //   });
    //   core.info(`Creating label (${LABEL.name}) - ` + createResponse.status);
    // } catch (error) {
    //   core.info(`Label (${LABEL.name}) exists.`);
    // }
    // if (CHECKS.prefixes && CHECKS.prefixes.length) {
    //   for (let i = 0; i < CHECKS.prefixes.length; i++) {
    //     if (title.startsWith(CHECKS.prefixes[i])) {
    //       removeLabel(LABEL.name);
    //       return;
    //     }
    //   }
    // }
    // if (CHECKS.regexp) {
    //   let re = new RegExp(CHECKS.regexp);
    //   if (re.test(title)) {
    //     removeLabel(LABEL.name);
    //     return;
    //   }
    // }
    // addLabel(LABEL.name, CHECKS.alwaysPassCI);
  } catch (error) {
    core.info(error);
  }
}

async function addLabel(name, alwaysPassCI) {
  //   try {
  //     let addLabelResponse = await octokit.issues.addLabels({
  //       owner,
  //       repo,
  //       issue_number,
  //       labels: [name],
  //     });
  //     core.info(`Adding label (${name}) - ` + addLabelResponse.status);
  //     if (!alwaysPassCI) core.setFailed("Failing CI test");
  //   } catch (error) {
  //     core.info("All OK");
  //   }
}

async function removeLabel(name) {
  //   try {
  //     let removeLabelResponse = await octokit.issues.removeLabel({
  //       owner,
  //       repo,
  //       issue_number,
  //       name: name,
  //     });
  //     core.info(
  //       "No mismatches found. Deleting label - " + removeLabelResponse.status
  //     );
  //   } catch (error) {
  //     core.info("All OK");
  //   }
}

async function addComment(errors: string[]) {
  octokit.issues.createComment({
    issue_number,
    owner,
    repo,
    body: `Hello! 👋
    
    There are a few issues with your PR:

    ${errors.join("\n")}
    `,
  });
}

run();
