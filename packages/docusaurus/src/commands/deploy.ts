/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import path from 'path';
import shell from 'shelljs';
import {
  BUILD_DIR_NAME,
  CONFIG_FILE_NAME,
  GENERATED_FILES_DIR_NAME,
} from '../constants';
import {loadConfig} from '../server/config';
import {build} from './build';

export async function deploy(siteDir: string): Promise<void> {
  console.log('Deploy command invoked ...');
  if (!shell.which('git')) {
    throw new Error('Sorry, this script requires git');
  }

  const gitToken = process.env.GIT_TOKEN;
  const gitUser = process.env.GIT_USER;
  if (!gitUser) {
    throw new Error(`Please set the GIT_USER`);
  }

  // The branch that contains the latest docs changes that will be deployed
  const currentBranch =
    process.env.CURRENT_BRANCH ||
    shell.exec('git rev-parse --abbrev-ref HEAD').stdout.trim();

  const siteConfig = loadConfig(siteDir);
  const organizationName =
    process.env.ORGANIZATION_NAME ||
    process.env.CIRCLE_PROJECT_USERNAME ||
    siteConfig.organizationName;
  if (!organizationName) {
    throw new Error(
      `Missing project organization name. Did you forget to define 'organizationName' in ${CONFIG_FILE_NAME}? You may also export it via the organizationName environment variable.`,
    );
  }
  const projectName =
    process.env.PROJECT_NAME ||
    process.env.CIRCLE_PROJECT_REPONAME ||
    siteConfig.projectName;
  if (!projectName) {
    throw new Error(
      `Missing project name. Did you forget to define 'projectName' in ${CONFIG_FILE_NAME}? You may also export it via the projectName environment variable.`,
    );
  }

  // We never deploy on pull request
  const isPullRequest =
    process.env.CI_PULL_REQUEST || process.env.CIRCLE_PULL_REQUEST;
  if (isPullRequest) {
    shell.echo('Skipping deploy on a pull request');
    shell.exit(0);
  }

  // github.io indicates organization repos that deploy via master. All others use gh-pages.
  const deploymentBranch =
    projectName.indexOf('.github.io') !== -1 ? 'master' : 'gh-pages';
  const githubHost =
    process.env.GITHUB_HOST || siteConfig.githubHost || 'github.com';

  const useSSH = process.env.USE_SSH;
  const remoteBranch = useSSH
    ? `git@${githubHost}:${organizationName}/${projectName}.git`
    : `https://${gitUser}${
        gitToken ? `:${gitToken}` : ''
      }@${githubHost}/${organizationName}/${projectName}.git`;

  // Check if this is a cross-repo publish
  const currentRepoUrl = shell
    .exec('git config --get remote.origin.url')
    .stdout.trim();
  const crossRepoPublish = !currentRepoUrl.endsWith(
    `${organizationName}/${projectName}.git`,
  );

  // We don't allow deploying to the same branch unless it's a cross publish
  if (currentBranch === deploymentBranch && !crossRepoPublish) {
    throw new Error(
      `Cannot deploy from a ${deploymentBranch} branch. Only to it`,
    );
  }

  // Save the commit hash that triggers publish-gh-pages before checking out to deployment branch
  const currentCommit = shell.exec('git rev-parse HEAD').stdout.trim();

  // Clear docusaurus 2 cache dir for deploy consistency
  const tempDir = path.join(siteDir, '.docusaurus');
  fs.removeSync(tempDir);

  // Collect Git identity from current repo's configuration
  const gitName = shell.exec('git config user.name').stdout.trim();
  const gitEmail = shell.exec('git config user.email').stdout.trim();

  // build static html files, then push to deploymentBranch branch of specified repo
  build(siteDir)
    .then(() => {
      shell.cd(tempDir);

      if (
        shell.exec(
          `git clone ${remoteBranch} ${projectName}-${deploymentBranch}`,
        ).code !== 0
      ) {
        throw new Error('Error: git clone failed');
      }

      shell.cd(`${projectName}-${deploymentBranch}`);


      // Set the Git identity for the temp deploy repo if it's available
      if(gitName) {
        shell.exec(`git config user.name "${gitName}"`).stdout.trim();
      }

      if(gitEmail) {
        shell.exec(`git config user.email "${gitEmail}"`).stdout.trim();
      }

      // If the default branch is the one we're deploying to, then we'll fail to create it.
      // This is the case of a cross-repo publish, where we clone a github.io repo with a default master branch.
      const defaultBranch = shell
        .exec('git rev-parse --abbrev-ref HEAD')
        .stdout.trim();
      if (defaultBranch !== deploymentBranch) {
        if (shell.exec(`git checkout origin/${deploymentBranch}`).code !== 0) {
          if (
            shell.exec(`git checkout --orphan ${deploymentBranch}`).code !== 0
          ) {
            throw new Error(`Error: Git checkout ${deploymentBranch} failed`);
          }
        } else if (
          shell.exec(`git checkout -b ${deploymentBranch}`).code +
            shell.exec(
              `git branch --set-upstream-to=origin/${deploymentBranch}`,
            ).code !==
          0
        ) {
          throw new Error(`Error: Git checkout ${deploymentBranch} failed`);
        }
      }

      shell.exec('git rm -rf .');

      shell.cd('../..');

      const fromPath = path.join(BUILD_DIR_NAME);
      const toPath = path.join(
        GENERATED_FILES_DIR_NAME,
        `${projectName}-${deploymentBranch}`,
      );

      fs.copy(fromPath, toPath, error => {
        if (error) {
          throw new Error(
            `Error: Copying build assets failed with error '${error}'`,
          );
        }

        shell.cd(toPath);
        shell.exec('git add --all');

        const commitMessage =
          process.env.CUSTOM_COMMIT_MESSAGE ||
          `Deploy website version based on ${currentCommit}`;
        const commitResults = shell.exec(`git commit -m "${commitMessage}"`);
        if (
          shell.exec(`git push --force origin ${deploymentBranch}`).code !== 0
        ) {
          throw new Error('Error: Git push failed');
        } else if (commitResults.code === 0) {
          // The commit might return a non-zero value when site is up to date.
          const websiteURL =
            githubHost === 'github.com'
              ? `https://${organizationName}.github.io/${projectName}` // gh-pages hosted repo
              : `https://${githubHost}/pages/${organizationName}/${projectName}`; // GitHub enterprise hosting.
          shell.echo(`Website is live at: ${websiteURL}`);
          shell.exit(0);
        }
      });
    })
    .catch(buildError => {
      console.error(buildError);
      process.exit(1);
    });
}
