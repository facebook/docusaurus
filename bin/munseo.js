#!/usr/bin/env node

const chalk = require('chalk');
const semver = require('semver');
const path = require('path');
const program = require('commander');
const {build, init, start} = require('../lib');
const requiredVersion = require('../package.json').engines.node;

if (!semver.satisfies(process.version, requiredVersion)) {
  console.log(
    chalk.red(`\nMinimum node version not met :)`) +
      chalk.yellow(
        `\nYou are using Node ${
          process.version
        }, Requirement: Node ${requiredVersion}.\n`
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
  .command('build [siteDir]')
  .description('Build website')
  .option(
    '-sic, --skip-image-compression <skipImageCompression>',
    'Skip compression of image assets (default: false)'
  )
  .action((siteDir = '.', {skipImageCompression}) => {
    wrapCommand(build)(path.resolve(siteDir), {skipImageCompression});
  });

program
  .command('init [projectDir]')
  .description('Initialize website')
  .action((projectDir = '.') => {
    wrapCommand(init)(path.resolve(projectDir));
  });

program
  .command('start [siteDir]')
  .description('Start development server')
  .option('-p, --port <port>', 'use specified port (default: 3000)')
  .option('-nw, --no-watch <noWatch>', 'disable live reload (default: false)')
  .action((siteDir = '.', {port, noWatch}) => {
    wrapCommand(start)(path.resolve(siteDir), {port, noWatch});
  });

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
