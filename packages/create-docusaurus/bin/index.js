#!/usr/bin/env node
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// @ts-check

const logger = require('@docusaurus/logger').default;
const semver = require('semver');
const path = require('path');
const program = require('commander');
const {default: init} = require('../lib');
const requiredVersion = require('../package.json').engines.node;

if (!semver.satisfies(process.version, requiredVersion)) {
  logger.error('Minimum Node.js version not met :(');
  logger.info`You are using Node.js number=${process.version}, Requirement: Node.js number=${requiredVersion}.`;
  process.exit(1);
}

function wrapCommand(fn) {
  return (...args) =>
    fn(...args).catch((err) => {
      logger.error(err.stack);
      process.exitCode = 1;
    });
}

program
  .version(require('../package.json').version)
  .usage('<command> [options]');

program
  .command('init [siteName] [template] [rootDir]', {isDefault: true})
  .option('--use-npm')
  .option('--skip-install')
  .option('--typescript')
  .description('Initialize website.')
  .action(
    (
      siteName,
      template,
      rootDir = '.',
      {useNpm, skipInstall, typescript} = {},
    ) => {
      wrapCommand(init)(path.resolve(rootDir), siteName, template, {
        useNpm,
        skipInstall,
        typescript,
      });
    },
  );

program.arguments('<command>').action((cmd) => {
  program.outputHelp();
  logger.error`Unknown command code=${cmd}.`;
});

program.parse(process.argv);

if (!process.argv.slice(1).length) {
  program.outputHelp();
}
