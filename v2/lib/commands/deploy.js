/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const path = require('path');
const shell = require('shelljs');
const fs = require('fs-extra');
const build = require('./build');
const loadConfig = require('../load/config');

module.exports = async function deploy(siteDir) {
  console.log('Deploy command invoked ...');
  if (!shell.which('git')) {
    throw new Error('Sorry, this script requires git');
  }

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
      "Missing project organization name. Did you forget to define 'organizationName' in siteConfig.js? You may also export it via the organizationName environment variable.",
    );
  }
  const projectName =
    process.env.PROJECT_NAME ||
    process.env.CIRCLE_PROJECT_REPONAME ||
    siteConfig.projectName;
  if (!projectName) {
    throw new Error(
      "Missing project name. Did you forget to define 'projectName' in siteConfig.js? You may also export it via the projectName environment variable.",
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
    : `https://${gitUser}@${githubHost}/${organizationName}/${projectName}.git`;

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

  // build static html files, then push to deploymentBranch branch of specified repo
  build(siteDir)
    .then(() => {
      shell.cd(siteDir);
      shell.cd('build');

      if (
        shell.exec(
          `git clone ${remoteBranch} ${projectName}-${deploymentBranch}`,
        ).code !== 0
      ) {
        throw new Error('Error: git clone failed');
      }

      shell.cd(`${projectName}-${deploymentBranch}`);

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

      const fromPath = path.join('build');
      const toPath = path.join('build', `${projectName}-${deploymentBranch}}`);
      // In github.io case, project is deployed to root. Need to not recursively
      // copy the deployment-branch to be.
      const excludePath = `${projectName}-${deploymentBranch}`;

      // cannot use shell.cp because it doesn't support copying dotfiles and we
      // need to copy directories like .circleci, for example
      // https://github.com/shelljs/shelljs/issues/79
      fs.copy(
        fromPath,
        toPath,
        src => {
          if (src.indexOf('.DS_Store') !== -1) {
            return false;
          }
          if (src.indexOf(excludePath) !== -1) {
            return false;
          }
          return true;
        },
        error => {
          if (error) {
            throw new Error(
              `Error: Copying build assets failed with error '${error}'`,
            );
          }

          shell.cd(path.join('build', `${projectName}-${deploymentBranch}`));
          shell.exec('git add --all');

          const commitMessage =
            process.env.CUSTOM_COMMIT_MESSAGE || 'Deploy website';
          const commitResults = shell.exec(
            `git commit -m "${commitMessage}" -m "Deploy website version based on ${currentCommit}"`,
          );
          if (shell.exec(`git push origin ${deploymentBranch}`).code !== 0) {
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
        },
      );
    })
    .catch(buildError => {
      console.error(buildError);
      process.exit(1);
    });
};
