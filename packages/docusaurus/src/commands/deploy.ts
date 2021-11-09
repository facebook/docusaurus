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
import {buildSshUrl, buildHttpsUrl} from './buildRemoteBranchUrl';

// GIT_PASS env variable should not appear in logs
function obfuscateGitPass(str: string) {
  const gitPass = process.env.GIT_PASS;
  return gitPass ? str.replace(gitPass, 'GIT_PASS') : str;
}

// Log executed commands so that user can figure out mistakes on his own
// for example: https://github.com/facebook/docusaurus/issues/3875
function shellExecLog(cmd: string) {
  try {
    const result = shell.exec(cmd);
    console.log(
      `${chalk.cyan('CMD:')} ${obfuscateGitPass(cmd)} ${chalk.cyan(
        `(code: ${result.code})`,
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

  if (typeof siteConfig.trailingSlash === 'undefined') {
    console.warn(
      chalk.yellow(`
Docusaurus recommendation:
When deploying to GitHub Pages, it is better to use an explicit "trailingSlash" site config.
Otherwise, GitHub Pages will add an extra trailing slash to your site urls only on direct-access (not when navigation) with a server redirect.
This behavior can have SEO impacts and create relative link issues.
`),
    );
  }

  console.log('Deploy command invoked...');
  if (!shell.which('git')) {
    throw new Error('Git not installed or on the PATH!');
  }

  // Source repo is the repo from where the command is invoked
  const sourceRepoUrl = shell
    .exec('git config --get remote.origin.url', {silent: true})
    .stdout.trim();

  // The source branch; defaults to the currently checked out branch
  const sourceBranch =
    process.env.CURRENT_BRANCH ||
    shell.exec('git rev-parse --abbrev-ref HEAD', {silent: true}).stdout.trim();

  const gitUser = process.env.GIT_USER;

  let useSSH =
    process.env.USE_SSH !== undefined &&
    process.env.USE_SSH.toLowerCase() === 'true';

  if (!gitUser && !useSSH) {
    // If USE_SSH is unspecified: try inferring from repo URL
    if (
      process.env.USE_SSH === undefined &&
      // ssh://***: explicit protocol
      (/^ssh:\/\//.test(sourceRepoUrl) ||
        // git@github.com:facebook/docusaurus.git
        /^([\w-]+@)?[\w.-]+:[\w./_-]+(\.git)?/.test(sourceRepoUrl))
    ) {
      useSSH = true;
    } else {
      throw new Error(
        'Please set the GIT_USER environment variable, or explicitly specify USE_SSH instead!',
      );
    }
  }

  const organizationName =
    process.env.ORGANIZATION_NAME ||
    process.env.CIRCLE_PROJECT_USERNAME ||
    siteConfig.organizationName;
  if (!organizationName) {
    throw new Error(
      `Missing project organization name. Did you forget to define "organizationName" in ${siteConfigPath}? You may also export it via the ORGANIZATION_NAME environment variable.`,
    );
  }
  console.log(`${chalk.cyan('organizationName:')} ${organizationName}`);

  const projectName =
    process.env.PROJECT_NAME ||
    process.env.CIRCLE_PROJECT_REPONAME ||
    siteConfig.projectName;
  if (!projectName) {
    throw new Error(
      `Missing project name. Did you forget to define "projectName" in ${siteConfigPath}? You may also export it via the PROJECT_NAME environment variable.`,
    );
  }
  console.log(`${chalk.cyan('projectName:')} ${projectName}`);

  // We never deploy on pull request.
  const isPullRequest =
    process.env.CI_PULL_REQUEST || process.env.CIRCLE_PULL_REQUEST;
  if (isPullRequest) {
    shell.echo('Skipping deploy on a pull request.');
    shell.exit(0);
  }

  // github.io indicates organization repos that deploy via default branch. All others use gh-pages.
  // Organization deploys looks like:
  // - Git repo: https://github.com/<organization>/<organization>.github.io
  // - Site url: https://<organization>.github.io
  const isGitHubPagesOrganizationDeploy = projectName.includes('.github.io');
  if (
    isGitHubPagesOrganizationDeploy &&
    !process.env.DEPLOYMENT_BRANCH &&
    !siteConfig.deploymentBranch
  ) {
    throw new Error(`For GitHub pages organization deployments, 'docusaurus deploy' does not assume anymore that 'master' is your default Git branch.
Please provide the branch name to deploy to as an environment variable, for example DEPLOYMENT_BRANCH=main or DEPLOYMENT_BRANCH=master .
You can also set the deploymentBranch property in docusaurus.config.js .`);
  }

  const deploymentBranch =
    process.env.DEPLOYMENT_BRANCH || siteConfig.deploymentBranch || 'gh-pages';
  console.log(`${chalk.cyan('deploymentBranch:')} ${deploymentBranch}`);

  const githubHost =
    process.env.GITHUB_HOST || siteConfig.githubHost || 'github.com';
  const githubPort = process.env.GITHUB_PORT || siteConfig.githubPort;

  let remoteBranch: string;
  if (useSSH) {
    remoteBranch = buildSshUrl(
      githubHost,
      organizationName,
      projectName,
      githubPort,
    );
  } else {
    const gitPass = process.env.GIT_PASS;
    const gitCredentials = gitPass ? `${gitUser!}:${gitPass}` : gitUser!;
    remoteBranch = buildHttpsUrl(
      gitCredentials,
      githubHost,
      organizationName,
      projectName,
      githubPort,
    );
  }

  console.log(
    `${chalk.cyan('Remote branch:')} ${obfuscateGitPass(remoteBranch)}`,
  );

  // Check if this is a cross-repo publish.
  const crossRepoPublish = !sourceRepoUrl.endsWith(
    `${organizationName}/${projectName}.git`,
  );

  // We don't allow deploying to the same branch unless it's a cross publish.
  if (sourceBranch === deploymentBranch && !crossRepoPublish) {
    throw new Error(
      `You cannot deploy from this branch (${sourceBranch}).` +
        '\nYou will need to checkout to a different branch!',
    );
  }

  // Save the commit hash that triggers publish-gh-pages before checking
  // out to deployment branch.
  const currentCommit = shellExecLog('git rev-parse HEAD').stdout.trim();

  const runDeploy = async (outputDirectory: string) => {
    const fromPath = outputDirectory;
    const toPath = await fs.mkdtemp(
      path.join(os.tmpdir(), `${projectName}-${deploymentBranch}`),
    );
    if (
      shellExecLog(
        `git clone --depth 1 --no-single-branch ${remoteBranch} ${toPath}`,
      ).code !== 0
    ) {
      throw new Error(`Running "git clone" command in "${toPath}" failed.`);
    }

    shell.cd(toPath);

    // If the default branch is the one we're deploying to, then we'll fail
    // to create it. This is the case of a cross-repo publish, where we clone
    // a github.io repo with a default branch.
    const defaultBranch = shell
      .exec('git rev-parse --abbrev-ref HEAD')
      .stdout.trim();
    if (defaultBranch !== deploymentBranch) {
      if (shellExecLog(`git checkout origin/${deploymentBranch}`).code !== 0) {
        if (
          shellExecLog(`git checkout --orphan ${deploymentBranch}`).code !== 0
        ) {
          throw new Error(
            `Running "git checkout ${deploymentBranch}" command failed.`,
          );
        }
      } else if (
        shellExecLog(`git checkout -b ${deploymentBranch}`).code +
          shellExecLog(
            `git branch --set-upstream-to=origin/${deploymentBranch}`,
          ).code !==
        0
      ) {
        throw new Error(
          `Running "git checkout ${deploymentBranch}" command failed.`,
        );
      }
    }

    shellExecLog('git rm -rf .');
    try {
      await fs.copy(fromPath, toPath);
    } catch (error) {
      throw new Error(
        `Copying build assets from "${fromPath}" to "${toPath}" failed with error "${error}".`,
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
      throw new Error('Running "git push" command failed.');
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
      shell.echo(`Website is live at "${websiteURL}".`);
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
