#!/usr/bin/env node
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// @ts-check

import logger from '@docusaurus/logger';
import semver from 'semver';
import cli from 'commander';
import path from 'path';
import {createRequire} from 'module';
import {migrateDocusaurusProject, migrateMDToMDX} from '../lib/index.js';

const requiredVersion = createRequire(import.meta.url)('../package.json')
  .engines.node;

function wrapCommand(fn) {
  return (...args) =>
    fn(...args).catch((err) => {
      logger.error(err.stack);
      process.exitCode = 1;
    });
}

if (!semver.satisfies(process.version, requiredVersion)) {
  logger.error('Minimum Node.js version not met :(');
  logger.info`You are using Node.js number=${process.version}, Requirement: Node.js number=${requiredVersion}.`;
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
