#!/usr/bin/env node
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const logger = require('@docusaurus/logger');
const semver = require('semver');
const cli = require('commander');
const path = require('path');

const requiredVersion = require('../package.json').engines.node;

const {migrateDocusaurusProject, migrateMDToMDX} = require('../lib');

function wrapCommand(fn) {
  return (...args) =>
    fn(...args).catch((err) => {
      console.error(pico.red(err.stack));
      process.exitCode = 1;
    });
}

if (!semver.satisfies(process.version, requiredVersion)) {
  logger.error('Minimum Node.js version not met :(');
  logger.error(
    `You are using Node.js ${process.version}, Requirement: Node.js ${requiredVersion}.`,
  );
  process.exit(1);
}

cli
  .command('migrate [siteDir] [newDir]')
  .option('--mdx', 'try to migrate MD to MDX too')
  .option('--page', 'try to migrate pages too')
  .description('Migrate between versions of Docusaurus website.')
  .action((siteDir = '.', newDir = '.', {mdx, page} = {}) => {
    const sitePath = path.resolve(siteDir);
    const newSitePath = path.resolve(newDir);
    wrapCommand(migrateDocusaurusProject)(sitePath, newSitePath, mdx, page);
  });

cli
  .command('mdx [siteDir] [newDir]')
  .description('Migrate markdown files to MDX.')
  .action((siteDir = '.', newDir = '.') => {
    const sitePath = path.resolve(siteDir);
    const newSitePath = path.resolve(newDir);
    wrapCommand(migrateMDToMDX)(sitePath, newSitePath);
  });
cli.parse(process.argv);

if (!process.argv.slice(2).length) {
  cli.outputHelp();
}
