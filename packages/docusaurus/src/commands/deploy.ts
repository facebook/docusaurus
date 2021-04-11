/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import shell from 'shelljs';
import chalk from 'chalk';
import {loadContext} from '../server';
import build from './build';
import {BuildCLIOptions} from '@docusaurus/types';
import path from 'path';
import os from 'os';
import {buildUrl} from './buildRemoteBranchUrl';

// GIT_PASS env variable should not appear in logs
function obfuscateGitPass(str) {
  const gitPass = process.env.GIT_PASS;
  return gitPass ? str.replace(gitPass, 'GIT_PASS') : str;
}

// Log executed commands so that user can figure out mistakes on his own
// for example: https://github.com/facebook/docusaurus/issues/3875
function shellExecLog(cmd) {
  try {
    const result = shell.exec(cmd);
    console.log(
      `${chalk.cyan('CMD:')} ${obfuscateGitPass(cmd)} ${chalk.cyan(
        `(code=${result.code})`,
      )}`,
    );
    return result;
  } catch (e) {
    console.log(`${chalk.red('CMD:')} ${obfuscateGitPass(cmd)}`);
    throw e;
  }
}

export default async function deploy(
  siteDir: string,
  cliOptions: Partial<BuildCLIOptions> = {},
): Promise<void> {
  const {outDir, siteConfig, siteConfigPath} = await loadContext(siteDir, {
    customConfigFilePath: cliOptions.config,
    customOutDir: cliOptions.outDir,
  });

  console.log('Deploy command invoked ...');
  if (!shell.which('git')) {
    throw new Error('Git not installed or on the PATH!');
  }

  const gitUser = process.env.GIT_USER;
  if (!gitUser) {
    throw new Error('Please set the GIT_USER environment variable!');
  }

  // The branch that contains the latest docs changes that will be deployed.
  const currentBranch =
    process.env.CURRENT_BRANCH ||
    shell.exec('git rev-parse --abbrev-ref HEAD').stdout.trim();

  const organizationName =
    process.env.ORGANIZATION_NAME ||
    process.env.CIRCLE_PROJECT_USERNAME ||
    siteConfig.organizationName;
  if (!organizationName) {
    throw new Error(
      `Missing project organization name. Did you forget to define 'organizationName' in ${siteConfigPath}? You may also export it via the ORGANIZATION_NAME environment variable.`,
    );
  }
  console.log(`${chalk.cyan('organizationName:')} ${organizationName}`);

  const projectName =
    process.env.PROJECT_NAME ||
    process.env.CIRCLE_PROJECT_REPONAME ||
    siteConfig.projectName;
  if (!projectName) {
    throw new Error(
      `Missing project name. Did you forget to define 'projectName' in ${siteConfigPath}? You may also export it via the PROJECT_NAME environment variable.`,
    );
  }
  console.log(`${chalk.cyan('projectName:')} ${projectName}`);

  // We never deploy on pull request.
  const isPullRequest =
    process.env.CI_PULL_REQUEST || process.env.CIRCLE_PULL_REQUEST;
  if (isPullRequest) {
    shell.echo('Skipping deploy on a pull request');
    shell.exit(0);
  }

  // github.io indicates organization repos that deploy via master. All others use gh-pages.
  const deploymentBranch =
    process.env.DEPLOYMENT_BRANCH ||
    (projectName.indexOf('.github.io') !== -1 ? 'master' : 'gh-pages');
  console.log(`${chalk.cyan('deploymentBranch:')} ${deploymentBranch}`);

  const githubHost =
    process.env.GITHUB_HOST || siteConfig.githubHost || 'github.com';
  const githubPort = process.env.GITHUB_PORT || siteConfig.githubPort;

  const gitPass: string | undefined = process.env.GIT_PASS;
  let gitCredentials = `${gitUser}`;
  if (gitPass) {
    gitCredentials = `${gitCredentials}:${gitPass}`;
  }

  const useSSH = process.env.USE_SSH;
  const remoteBranch = buildUrl(
    githubHost,
    githubPort,
    gitCredentials,
    organizationName,
    projectName,
    useSSH !== undefined && useSSH.toLowerCase() === 'true',
  );

  console.log(
    `${chalk.cyan('Remote branch:')} ${obfuscateGitPass(remoteBranch)}`,
  );

  // Check if this is a cross-repo publish.
  const currentRepoUrl = shell
    .exec('git config --get remote.origin.url')
    .stdout.trim();
  const crossRepoPublish = !currentRepoUrl.endsWith(
    `${organizationName}/${projectName}.git`,
  );

  // We don't allow deploying to the same branch unless it's a cross publish.
  if (currentBranch === deploymentBranch && !crossRepoPublish) {
    throw new Error(
      `You cannot deploy from this branch (${currentBranch}).` +
        '\nYou will need to checkout to a different branch!',
    );
  }

  // Save the commit hash that triggers publish-gh-pages before checking
  // out to deployment branch.
  const currentCommit = shellExecLog('git rev-parse HEAD').stdout.trim();

  const runDeploy = async (outputDirectory) => {
    const fromPath = outputDirectory;
    const toPath = await fs.mkdtemp(
      path.join(os.tmpdir(), `${projectName}-${deploymentBranch}`),
    );
    if (shellExecLog(`git clone ${remoteBranch} ${toPath}`).code !== 0) {
      throw new Error(`Error: git clone failed in ${toPath}`);
    }

    shell.cd(toPath);

    // If the default branch is the one we're deploying to, then we'll fail
    // to create it. This is the case of a cross-repo publish, where we clone
    // a github.io repo with a default master branch.
    const defaultBranch = shell
      .exec('git rev-parse --abbrev-ref HEAD')
      .stdout.trim();
    if (defaultBranch !== deploymentBranch) {
      if (shellExecLog(`git checkout origin/${deploymentBranch}`).code !== 0) {
        if (
          shellExecLog(`git checkout --orphan ${deploymentBranch}`).code !== 0
        ) {
          throw new Error(`Error: Git checkout ${deploymentBranch} failed`);
        }
      } else if (
        shellExecLog(`git checkout -b ${deploymentBranch}`).code +
          shellExecLog(
            `git branch --set-upstream-to=origin/${deploymentBranch}`,
          ).code !==
        0
      ) {
        throw new Error(`Error: Git checkout ${deploymentBranch} failed`);
      }
    }

    shellExecLog('git rm -rf .');
    try {
      await fs.copy(fromPath, toPath);
    } catch (error) {
      throw new Error(
        `Error: Copying build assets from "${fromPath}" to "${toPath}" failed with error '${error}'`,
      );
    }
    shell.cd(toPath);
    shellExecLog('git add --all');

    const commitMessage =
      process.env.CUSTOM_COMMIT_MESSAGE ||
      `Deploy website - based on ${currentCommit}`;
    const commitResults = shellExecLog(`git commit -m "${commitMessage}"`);
    if (
      shellExecLog(`git push --force origin ${deploymentBranch}`).code !== 0
    ) {
      throw new Error('Error: Git push failed');
    } else if (commitResults.code === 0) {
      // The commit might return a non-zero value when site is up to date.
      let websiteURL = '';
      if (githubHost === 'github.com') {
        websiteURL = projectName.includes('.github.io')
          ? `https://${organizationName}.github.io/`
          : `https://${organizationName}.github.io/${projectName}/`;
      } else {
        // GitHub enterprise hosting.
        websiteURL = `https://${githubHost}/pages/${organizationName}/${projectName}/`;
      }
      shell.echo(`Website is live at ${websiteURL}`);
      shell.exit(0);
    }
  };

  if (!cliOptions.skipBuild) {
    // Build static html files, then push to deploymentBranch branch of specified repo.
    try {
      await runDeploy(await build(siteDir, cliOptions, false));
    } catch (buildError) {
      console.error(buildError);
      process.exit(1);
    }
  } else {
    // Push current build to deploymentBranch branch of specified repo.
    await runDeploy(outDir);
  }
}
