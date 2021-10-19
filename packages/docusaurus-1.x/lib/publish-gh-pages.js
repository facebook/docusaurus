#!/usr/bin/env node

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const fs = require('fs-extra');
const path = require('path');
const shell = require('shelljs');

if (!shell.which('git')) {
  shell.echo('Sorry, this script requires git');
  shell.exit(1);
}

const siteConfig = require(`${process.cwd()}/siteConfig.js`);
const GIT_USER = process.env.GIT_USER;
const CURRENT_BRANCH =
  process.env.CIRCLE_BRANCH ||
  shell.exec('git rev-parse --abbrev-ref HEAD').stdout.trim();
const ORGANIZATION_NAME =
  process.env.ORGANIZATION_NAME ||
  process.env.CIRCLE_PROJECT_USERNAME ||
  siteConfig.organizationName;
const PROJECT_NAME =
  process.env.PROJECT_NAME ||
  process.env.CIRCLE_PROJECT_REPONAME ||
  siteConfig.projectName;
const IS_PULL_REQUEST =
  process.env.CI_PULL_REQUEST || process.env.CIRCLE_PULL_REQUEST;
const USE_SSH = process.env.USE_SSH;
// github.io indicates organization repos that deploy via master. All others use gh-pages.
const DEPLOYMENT_BRANCH =
  PROJECT_NAME.indexOf('.github.io') !== -1 ? 'master' : 'gh-pages';
const GITHUB_DOMAIN = 'github.com';
// For GitHub enterprise, allow specifying a different host.
const GITHUB_HOST =
  process.env.GITHUB_HOST || siteConfig.githubHost || GITHUB_DOMAIN;
const CUSTOM_COMMIT_MESSAGE = process.env.CUSTOM_COMMIT_MESSAGE;

if (!ORGANIZATION_NAME) {
  shell.echo(
    "Missing project organization name. Did you forget to define 'organizationName' in siteConfig.js? You may also export it via the ORGANIZATION_NAME environment variable.",
  );
  shell.exit(0);
}

if (!PROJECT_NAME) {
  shell.echo(
    "Missing project name. Did you forget to define 'projectName' in siteConfig.js? You may also export it via the PROJECT_NAME environment variable.",
  );
  shell.exit(0);
}

if (USE_SSH !== 'true' && !GIT_USER) {
  shell.echo(
    "Missing git user. Did you forget to export the 'GIT_USER' environment variable?",
  );
  shell.exit(0);
}

let remoteBranch;
if (USE_SSH === 'true') {
  remoteBranch = `git@${GITHUB_HOST}:${ORGANIZATION_NAME}/${PROJECT_NAME}.git`;
} else {
  remoteBranch = `https://${GIT_USER}@${GITHUB_HOST}/${ORGANIZATION_NAME}/${PROJECT_NAME}.git`;
}

if (IS_PULL_REQUEST) {
  shell.echo('Skipping deploy on a pull request');
  shell.exit(0);
}

// When we want to do a cross repo publish (#717), we can allow publishing to the same branch.
const currentRepoUrl = shell
  .exec('git config --get remote.origin.url')
  .stdout.trim();
const crossRepoPublish = !currentRepoUrl.endsWith(
  `${ORGANIZATION_NAME}/${PROJECT_NAME}.git`,
);

// build static html files, then push to DEPLOYMENT_BRANCH branch of specified repo

if (CURRENT_BRANCH === DEPLOYMENT_BRANCH && !crossRepoPublish) {
  shell.echo(`Cannot deploy from a ${DEPLOYMENT_BRANCH} branch. Only to it`);
  shell.exit(1);
}

if (
  shell.exec(
    `node ${path.join(__dirname, 'build-files.js')} ${process.argv
      .slice(2)
      .join(' ')}`,
  ).code
) {
  shell.echo('Error: generating html failed');
  shell.exit(1);
}

// Save the commit hash that triggers publish-gh-pages before checking out to deployment branch
const currentCommit = shell.exec('git rev-parse HEAD').stdout.trim();

shell.cd(process.cwd());
shell.cd('build');

if (
  shell.exec(`git clone ${remoteBranch} ${PROJECT_NAME}-${DEPLOYMENT_BRANCH}`)
    .code !== 0
) {
  shell.echo('Error: git clone failed');
  shell.exit(1);
}

shell.cd(`${PROJECT_NAME}-${DEPLOYMENT_BRANCH}`);

// If the default branch is the one we're deploying to, then we'll fail to create it.
// This is the case of a cross-repo publish, where we clone a github.io repo with a default master branch.
const defaultBranch = shell
  .exec('git rev-parse --abbrev-ref HEAD')
  .stdout.trim();
if (defaultBranch !== DEPLOYMENT_BRANCH) {
  if (shell.exec(`git checkout origin/${DEPLOYMENT_BRANCH}`).code !== 0) {
    if (shell.exec(`git checkout --orphan ${DEPLOYMENT_BRANCH}`).code !== 0) {
      shell.echo(`Error: Git checkout ${DEPLOYMENT_BRANCH} failed`);
      shell.exit(1);
    }
  } else if (
    shell.exec(`git checkout -b ${DEPLOYMENT_BRANCH}`).code +
      shell.exec(`git branch --set-upstream-to=origin/${DEPLOYMENT_BRANCH}`)
        .code !==
    0
  ) {
    shell.echo(`Error: Git checkout ${DEPLOYMENT_BRANCH} failed`);
    shell.exit(1);
  }
}

shell.exec('git rm -rf .');

shell.cd('../..');

const fromPath = path.join('build', `${PROJECT_NAME}`);
const toPath = path.join('build', `${PROJECT_NAME}-${DEPLOYMENT_BRANCH}`);
// In github.io case, project is deployed to root. Need to not recursively
// copy the deployment-branch to be.
const excludePath = `${PROJECT_NAME}-${DEPLOYMENT_BRANCH}`;

// cannot use shell.cp because it doesn't support copying dotfiles and we
// need to copy directories like .circleci, for example
// https://github.com/shelljs/shelljs/issues/79
fs.copy(
  fromPath,
  toPath,
  (src) => {
    if (src.indexOf('.DS_Store') !== -1) {
      return false;
    }
    if (src.indexOf(excludePath) !== -1) {
      return false;
    }

    return true;
  },
  (error) => {
    if (error) {
      shell.echo(`Error: Copying build assets failed with error '${error}'`);
      shell.exit(1);
    }

    shell.cd(path.join('build', `${PROJECT_NAME}-${DEPLOYMENT_BRANCH}`));
    shell.exec('git add --all');

    const commitMessage = CUSTOM_COMMIT_MESSAGE || 'Deploy website';
    const commitResults = shell.exec(
      `git commit -m "${commitMessage}" -m "Deploy website version based on ${currentCommit}"`,
    );
    if (shell.exec(`git push origin ${DEPLOYMENT_BRANCH}`).code !== 0) {
      shell.echo('Error: Git push failed');
      shell.exit(1);
    } else if (commitResults.code === 0) {
      // The commit might return a non-zero value when site is up to date.
      const websiteURL =
        GITHUB_HOST === GITHUB_DOMAIN
          ? `https://${ORGANIZATION_NAME}.github.io/${PROJECT_NAME}` // gh-pages hosted repo
          : `https://${GITHUB_HOST}/pages/${ORGANIZATION_NAME}/${PROJECT_NAME}`; // GitHub enterprise hosting.
      shell.echo(`Website is live at: ${websiteURL}`);
      shell.exit(0);
    }
  },
);
