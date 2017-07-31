#!/usr/bin/env node

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

const shell = require("shelljs");

const GIT_USER = process.env.GIT_USER;
const CIRCLE_BRANCH = process.env.CIRCLE_BRANCH;
const CIRCLE_PROJECT_USERNAME = process.env.CIRCLE_PROJECT_USERNAME;
const CIRCLE_PROJECT_REPONAME = process.env.CIRCLE_PROJECT_REPONAME;
const CI_PULL_REQUEST = process.env.CI_PULL_REQUEST;
const remoteBranch = `https://${GIT_USER}@github.com/${CIRCLE_PROJECT_USERNAME}/${CIRCLE_PROJECT_REPONAME}.git`;

if (!shell.which("git")) {
  shell.echo("Sorry, this script requires git");
  shell.exit(1);
}

if (CI_PULL_REQUEST || CIRCLE_BRANCH !== `master`) {
  shell.echo("Skipping deploy");
  shell.exit(0);
}

if (shell.exec("docusaurus-build").code) {
  shell.echo("Error: generating html failed");
  shell.exit(1);
}

shell.cd(process.cwd());
shell.cd("build");

if (
  shell.exec(`git clone ${remoteBranch} ${CIRCLE_PROJECT_REPONAME}-gh-pages`)
    .code !== 0
) {
  shell.echo("Error: git clone failed");
  shell.exit(1);
}

shell.cd(`${CIRCLE_PROJECT_REPONAME}-gh-pages`);

if (
  shell.exec("git checkout origin/gh-pages").code +
    shell.exec("git checkout -b gh-pages").code +
    shell.exec("git branch --set-upstream-to=origin/gh-pages").code !==
  0
) {
  shell.echo("Error: Git checkout gh-pages failed");
  shell.exit(1);
}

shell.exec("rm -rf *");

shell.cd("../..");

shell.cp(
  "-R",
  `build/${CIRCLE_PROJECT_REPONAME}/*`,
  `build/${CIRCLE_PROJECT_REPONAME}-gh-pages/`
);
shell.cd(`build/${CIRCLE_PROJECT_REPONAME}-gh-pages`);

shell.exec("git add --all");
shell.exec('git commit -m "update website [ci skip]"');
if (shell.exec("git push origin gh-pages").code !== 0) {
  shell.echo("Error: Git push failed");
  shell.exit(1);
} else {
  shell.echo(
    `Website is live at: https://${CIRCLE_PROJECT_USERNAME}.github.io/${CIRCLE_PROJECT_REPONAME}/`
  );
  shell.exit(0);
}
