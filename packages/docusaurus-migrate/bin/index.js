#!/usr/bin/env node

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const chalk = require('chalk');
const semver = require('semver');
const cli = require('commander');
const path = require('path');

const requiredVersion = require('../package.json').engines.node;

const {createProjectStructure} = require('../lib');

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function wrapCommand(fn) {
  return (...args) =>
    fn(...args).catch((err) => {
      console.error(chalk.red(err.stack));
      process.exitCode = 1;
    });
}

if (!semver.satisfies(process.version, requiredVersion)) {
  console.log(
    chalk.red(`\nMinimum Node version not met :(`) +
      chalk.yellow(
        `\n\nYou are using Node ${process.version}. We require Node ${requiredVersion} or up!\n`,
      ),
  );
  process.exit(1);
}

cli
  .command('migrate [siteDir] [newDir]')
  .description('Migrate between versions of docusaurs website')
  .option('--dry', 'List all possible changes')
  .action((siteDir = '.', newdir = '.', {dry}) => {
    const sitePath = path.resolve(`${process.cwd()}/${siteDir}`);
    // eslint-disable-next-line import/no-dynamic-require
    // eslint-disable-next-line global-require
    const config = require(`${sitePath}/siteConfig`);
    createProjectStructure(sitePath, config, newdir);
  });

cli.parse(process.argv);

if (!process.argv.slice(2).length) {
  cli.outputHelp();
}
