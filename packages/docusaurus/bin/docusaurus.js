#!/usr/bin/env node

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const chalk = require('chalk');
const semver = require('semver');
const path = require('path');
const cli = require('commander');
const {build, swizzle, deploy, start, externalCommand} = require('../lib');
const requiredVersion = require('../package.json').engines.node;

if (!semver.satisfies(process.version, requiredVersion)) {
  console.log(
    chalk.red(`\nMinimum Node version not met :(`) +
      chalk.yellow(
        `\n\nYou are using Node ${process.version}. We require Node ${requiredVersion} or up!\n`,
      ),
  );
  process.exit(1);
}

function wrapCommand(fn) {
  return (...args) =>
    fn(...args).catch((err) => {
      console.error(chalk.red(err.stack));
      process.exitCode = 1;
    });
}

cli.version(require('../package.json').version).usage('<command> [options]');

cli
  .command('build [siteDir]')
  .description('Build website')
  .option(
    '--bundle-analyzer',
    'Visualize size of webpack output files with an interactive zoomable treemap (default: false)',
  )
  .option(
    '--out-dir <dir>',
    'The full path for the new output directory, relative to the current workspace (default: build).',
  )
  .option(
    '--no-minify',
    'Build website without minimizing JS bundles (default: false)',
  )
  .action((siteDir = '.', {bundleAnalyzer, outDir, minify}) => {
    wrapCommand(build)(path.resolve(siteDir), {
      bundleAnalyzer,
      outDir,
      minify,
    });
  });

cli
  .command('swizzle <themeName> [componentName] [siteDir]')
  .description('Copy the theme files into website folder for customization.')
  .action((themeName, componentName, siteDir = '.') => {
    wrapCommand(swizzle)(path.resolve(siteDir), themeName, componentName);
  });

cli
  .command('deploy [siteDir]')
  .description('Deploy website to GitHub pages')
  .option(
    '--out-dir <dir>',
    'The full path for the new output directory, relative to the current workspace (default: build).',
  )
  .action((siteDir = '.', {outDir}) => {
    wrapCommand(deploy)(path.resolve(siteDir), {outDir});
  });

cli
  .command('start [siteDir]')
  .description('Start the development server')
  .option('-p, --port <port>', 'use specified port (default: 3000)')
  .option('-h, --host <host>', 'use specified host (default: localhost')
  .option(
    '--hot-only',
    'Do not fallback to page refresh if hot reload fails (default: false)',
  )
  .option('--no-open', 'Do not open page in the browser (default: false)')
  .option(
    '--poll',
    'Use polling rather than wathcing for reload (default: false)',
  )
  .action((siteDir = '.', {port, host, hotOnly, open, poll}) => {
    wrapCommand(start)(path.resolve(siteDir), {
      port,
      host,
      hotOnly,
      open,
      poll,
    });
  });

cli.arguments('<command>').action((cmd) => {
  cli.outputHelp();
  console.log(`  ${chalk.red(`\n  Unknown command ${chalk.yellow(cmd)}.`)}`);
  console.log();
});

function isInternalCommand(command) {
  return ['start', 'build', 'swizzle', 'deploy'].includes(command);
}

if (!isInternalCommand(process.argv.slice(2)[0])) {
  externalCommand(cli, path.resolve('.'));
}

cli.parse(process.argv);

if (!process.argv.slice(2).length) {
  cli.outputHelp();
}
