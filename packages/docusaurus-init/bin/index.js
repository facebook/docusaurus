#!/usr/bin/env node

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const color = require('colorette');
const semver = require('semver');
const path = require('path');
const program = require('commander');
const {default: init} = require('../lib');
const requiredVersion = require('../package.json').engines.node;

if (!semver.satisfies(process.version, requiredVersion)) {
  console.log(`${color.red('Minimum Node version not met :)')}
${color.yellow(
  `You are using Node ${process.version} - requirement: ${requiredVersion}.`,
)}`);
  process.exit(1);
}

function wrapCommand(fn) {
  return (...args) =>
    fn(...args).catch((err) => {
      console.error(color.red(err.stack));
      process.exitCode = 1;
    });
}

program
  .version(require('../package.json').version)
  .usage('<command> [options]');

program
  .command('init [siteName] [template] [rootDir]')
  .option('--use-npm')
  .option('--skip-install')
  .description('Initialize website')
  .action((siteName, template, rootDir = '.', {useNpm, skipInstall}) => {
    wrapCommand(init)(path.resolve(rootDir), siteName, template, {
      useNpm,
      skipInstall,
    });
  });

program.arguments('<command>').action((cmd) => {
  program.outputHelp();
  console.log(`  ${color.red(`\n  Unknown command ${color.yellow(cmd)}.`)}`);
  console.log();
});

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
