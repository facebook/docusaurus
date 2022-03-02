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
import path from 'path';
import {program} from 'commander';
import {createRequire} from 'module';
import init from '../lib/index.js';

const packageJson = createRequire(import.meta.url)('../package.json');
const requiredVersion = packageJson.engines.node;

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

program.version(packageJson.version);

program
  .arguments('[siteName] [template] [rootDir]')
  .option(
    '-p, --package-manager <manager>',
    'The package manager used to install dependencies. One of yarn, npm, and pnpm.',
  )
  .option(
    '-s, --skip-install',
    'Do not run package manager immediately after scaffolding',
  )
  .option('-t, --typescript', 'Use the TypeScript template variant')
  .option(
    '-g, --git-strategy <strategy>',
    `Only used if the template is a git repository.
\`deep\`: preserve full history
\`shallow\`: clone with --depth=1
\`copy\`: do a shallow clone, but do not create a git repo
\`custom\`: enter your custom git clone command. We will prompt you for it.`,
  )
  .description('Initialize website.')
  .action(
    (
      siteName,
      template,
      rootDir = '.',
      {packageManager, skipInstall, typescript, gitStrategy} = {},
    ) => {
      wrapCommand(init)(path.resolve(rootDir), siteName, template, {
        packageManager,
        skipInstall,
        typescript,
        gitStrategy,
      });
    },
  );

program.parse(process.argv);

if (!process.argv.slice(1).length) {
  program.outputHelp();
}
