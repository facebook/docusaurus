#!/usr/bin/env node

const chalk = require('chalk');
const semver = require('semver');
const path = require('path');
const program = require('commander');
const {dev, build} = require('../lib');
const requiredVersion = require('../package.json').engines.node;

if (!semver.satisfies(process.version, requiredVersion)) {
  console.log(
    chalk.red(`\nMinimum node version not met :)`) +
      chalk.yellow(
        `\nYou are using Node ${
          process.version
        }, but blogi requires Node ${requiredVersion}.\n`
      )
  );
  process.exit(1);
}

function wrapCommand(fn) {
  return (...args) =>
    fn(...args).catch(err => {
      console.error(chalk.red(err.stack));
      process.exitCode = 1;
    });
}

program
  .version(require('../package.json').version)
  .usage('<command> [options]');

program
  .command('dev [targetDir]')
  .description('start development server')
  .option('-p, --port <port>', 'use specified port (default: 8080)')
  .action((dir = '.', {port}) => {
    wrapCommand(dev)(path.resolve(dir), {port});
  });

program
  .command('build [targetDir]')
  .description('build dir as static site')
  .option(
    '-d, --dest <outDir>',
    'specify build output dir (default: .blogi/dist)'
  )
  .action((dir = '.', {dest}) => {
    const outDir = dest ? path.resolve(dest) : null;
    wrapCommand(build)(path.resolve(dir), {outDir});
  });

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
