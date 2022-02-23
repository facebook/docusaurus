#!/usr/bin/env node
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import logger from '@docusaurus/logger';
import cli from 'commander';
import build from '../lib/build.js';
import watch from '../lib/watch.js';

cli
  .command('build')
  .option('--source-dir <dir>')
  .option('--target-dir <dir>')
  .option('--theme-dir <dir>')
  .option('--theme-target-dir <dir>')
  .option('--ignore <pattern>')
  .action(build);

cli
  .command('watch')
  .option('--source-dir <dir>')
  .option('--target-dir <dir>')
  .option('--ignore <pattern>')
  .action(watch);

cli.arguments('<command>').action((cmd) => {
  cli.outputHelp();
  logger.error`    Unknown command name=${cmd}.`;
});

cli.parse(process.argv);

if (!process.argv.slice(2).length) {
  cli.outputHelp();
}
