#!/usr/bin/env node

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

require('@babel/register')({
  babelrc: false,
  only: [__dirname, `${process.cwd()}/core`],
  plugins: [
    require('./server/translate-plugin.js'),
    require('@babel/plugin-proposal-class-properties').default,
    require('@babel/plugin-proposal-object-rest-spread').default,
  ],
  presets: [
    require('@babel/preset-react').default,
    require('@babel/preset-env').default,
  ],
});

const chalk = require('chalk');
const fs = require('fs');
const program = require('commander');

const CWD = process.cwd();
const env = require('./server/env.js');

const {startDocusaurus} = require('./server/start.js');

if (!fs.existsSync(`${CWD}/siteConfig.js`)) {
  console.error(
    chalk.red('Error: No siteConfig.js file found in website folder!'),
  );
  process.exit(1);
}

if (env.versioning.enabled && env.versioning.missingVersionsPage) {
  env.versioning.printMissingVersionsPageError();
  process.exit(1);
}

program
  .option('--port <number>', 'Specify port number')
  .option('--no-watch', 'Toggle live reload file watching')
  .option('--host <host>', 'use specified host (default: localhost)')
  .parse(process.argv);

startDocusaurus().catch(ex => {
  console.error(chalk.red(`Failed to start Docusaurus server: ${ex}`));
  process.exit(1);
});
