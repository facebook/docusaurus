#!/usr/bin/env node

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
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
  console.log(
    "In order for Docusaurus to get set up as your static site generator, you will need to remove any existing 'website' folder from your root directory. If you are migrating from another static site generator, you may want to move your old website folder to a different location."
  );
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
