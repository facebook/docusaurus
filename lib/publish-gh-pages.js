#!/usr/bin/env node

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const path = require('path');
const Rsync = require('rsync');
const shell = require('shelljs');

if (!shell.which('git')) {
  shell.echo('Sorry, this script requires git');
  shell.exit(1);
}

const siteConfig = require(process.cwd() + '/siteConfig.js');
const GIT_USER = process.env.GIT_USER;
const CURRENT_BRANCH =
  process.env.CIRCLE_BRANCH || shell.exec('git rev-parse --abbrev-ref HEAD');
const ORGANIZATION_NAME =
  siteConfig.organizationName ||
  process.env.ORGANIZATION_NAME ||
  process.env.CIRCLE_PROJECT_USERNAME;
const PROJECT_NAME =
  siteConfig.projectName ||
  process.env.PROJECT_NAME ||
  process.env.CIRCLE_PROJECT_REPONAME;
const IS_PULL_REQUEST =
  process.env.CI_PULL_REQUEST || process.env.CIRCLE_PULL_REQUEST;
const USE_SSH = process.env.USE_SSH;
// github.io indicates organization repos that deploy via master. All others use gh-pages.
const DEPLOYMENT_BRANCH =
  PROJECT_NAME.indexOf('.github.io') !== -1 ? 'master' : 'gh-pages';
const PROJECT_PATH =
  PROJECT_NAME.indexOf('.github.io') !== -1 ? '' : PROJECT_NAME;

if (!ORGANIZATION_NAME) {
  shell.echo(
    "Missing project organization name. Did you forget to define 'organizationName' in siteConfig.js? You may also export it via the ORGANIZATION_NAME environment variable."
  );
  shell.exit(0);
}

if (!PROJECT_NAME) {
  shell.echo(
    "Missing project name. Did you forget to define 'projectName' in siteConfig.js? You may also export it via the PROJECT_NAME environment variable."
  );
  shell.exit(0);
}

let remoteBranch;
if (USE_SSH === 'true') {
  remoteBranch = `git@github.com:${ORGANIZATION_NAME}/${PROJECT_NAME}.git`;
} else {
  remoteBranch = `https://${GIT_USER}@github.com/${ORGANIZATION_NAME}/${PROJECT_NAME}.git`;
}

if (IS_PULL_REQUEST) {
  shell.echo('Skipping deploy on a pull request');
  shell.exit(0);
}

// build static html files, then push to DEPLOYMENT_BRANCH branch of specified repo

if (CURRENT_BRANCH === DEPLOYMENT_BRANCH) {
  shell.echo(`Cannot deploy from a ${DEPLOYMENT_BRANCH} branch. Only to it`);
  shell.exit(1);
}

if (shell.exec(`node ${path.join(__dirname, 'build-files.js')}`).code) {
  shell.echo('Error: generating html failed');
  shell.exit(1);
}

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

if (shell.exec(`git checkout origin/${DEPLOYMENT_BRANCH}`).code !== 0) {
  if (shell.exec(`git checkout --orphan ${DEPLOYMENT_BRANCH}`).code !== 0) {
    shell.echo(`Error: Git checkout ${DEPLOYMENT_BRANCH} failed`);
    shell.exit(1);
  }
} else {
  if (
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

fromPath = path.join('build', PROJECT_PATH, '/');
toPath = path.join('build', `${PROJECT_NAME}-${DEPLOYMENT_BRANCH}`);
// In github.io case, project is deployed to root. Need to not recursively
// copy the deployment-branch to be.
excludePath = `${PROJECT_NAME}-${DEPLOYMENT_BRANCH}`;
// cannot use shell.cp because it doesn't support copying dotfiles and we
// need to copy directories like .circleci, for example
// https://github.com/shelljs/shelljs/issues/79
const rsync = new Rsync()
  .flags('rt')
  .exclude(excludePath)
  .exclude('.DS_Store')
  .source(fromPath)
  .destination(toPath);

rsync.execute((error, code, cmd) => {
  if (code !== 0) {
    shell.echo(
      `Error: Copying build assets failed with code ${code} and error '${error}'`
    );
    shell.exit(1);
  } else {
    shell.cd(path.join('build', `${PROJECT_NAME}-${DEPLOYMENT_BRANCH}`));

    const currentCommit = shell.exec('git rev-parse HEAD').stdout.trim();

    shell.exec('git add --all');

    const commitResults = shell.exec(
      `git commit -m "Deploy website" -m "Deploy website version based on ${currentCommit}"`
    );
    if (shell.exec(`git push origin ${DEPLOYMENT_BRANCH}`).code !== 0) {
      shell.echo('Error: Git push failed');
      shell.exit(1);
    } else if (commitResults.code === 0) {
      // The commit might return a non-zero value when site is up to date.
      shell.echo(
        `Website is live at: https://${ORGANIZATION_NAME}.github.io/${PROJECT_PATH}`
      );
      shell.exit(0);
    }
  }
});
