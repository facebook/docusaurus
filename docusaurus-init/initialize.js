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
const chalk = require("chalk");
const fs = require("fs");

const CWD = process.cwd();

let useYarn = false;
if (shell.which("yarn")) {
  useYarn = true;
}

if (fs.existsSync(CWD + "/website")) {
  console.error(chalk.yellow("Website folder already exists.\n"));
  process.exit(1);
}

shell.cd(CWD);

shell.mkdir("website");

console.log(chalk.green("Website folder created!\n"));

shell.cd("website");

console.log(
  chalk.yellow("Installing latest version of Docusaurus in website.\n")
);

const packageContent = { scripts: { examples: "docusaurus-examples" } };
fs.writeFileSync(CWD + "/website/package.json", JSON.stringify(packageContent));

if (useYarn) {
  shell.exec("yarn add docusaurus --dev");
} else {
  shell.exec("npm install docusaurus --save-dev");
}

console.log(chalk.green("Docusaurus installed in website folder!\n"));

if (useYarn) {
  shell.exec("yarn run examples");
} else {
  shell.exec("npm run examples");
}
