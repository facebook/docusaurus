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
const {
  build,
  swizzle,
  deploy,
  start,
  externalCommand,
  serve,
} = require('../lib');
const requiredVersion = require('../package.json').engines.node;
const pkg = require('../package.json');
const updateNotifier = require('update-notifier');
const boxen = require('boxen');

// notify user if @docusaurus/core is outdated
const notifier = updateNotifier({
  pkg,
  updateCheckInterval: 1000 * 60 * 60 * 24, // one day
  distTag: 'next', // compare with the version that is tagged 'next' on npm
});

// allow the user to be notified for updates on the first run
if (notifier.lastUpdateCheck === Date.now()) {
  notifier.lastUpdateCheck = 0;
}

if (notifier.update && notifier.update.current !== notifier.update.latest) {
  const boxenOptions = {
    padding: 1,
    margin: 1,
    align: 'center',
    borderColor: 'yellow',
    borderStyle: 'round',
  };

  const docusaurusUpdateMessage = boxen(
    `Update available ${chalk.dim(`${notifier.update.current}`)}${chalk.reset(
      ' → ',
    )}${chalk.green(`${notifier.update.latest}`)}\nRun ${chalk.cyan(
      'yarn upgrade @docusaurus/core@next',
    )} to update`,
    boxenOptions,
  );

  console.log(docusaurusUpdateMessage);
}

// notify user if node version needs to be updated
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
    '-l, --locale <locale>',
    'Build the site in a specified locale. Build all known locales otherwise.',
  )
  .option(
    '--no-minify',
    'Build website without minimizing JS bundles (default: false)',
  )
  .action((siteDir = '.', {bundleAnalyzer, outDir, locale, minify}) => {
    wrapCommand(build)(path.resolve(siteDir), {
      bundleAnalyzer,
      outDir,
      locale,
      minify,
    });
  });

cli
  .command('swizzle [themeName] [componentName] [siteDir]')
  .description('Copy the theme files into website folder for customization.')
  .option(
    '--typescript',
    'Copy TypeScript theme files when possible (default: false)',
  )
  .option('--danger', 'Enable swizzle for internal component of themes')
  .action((themeName, componentName, siteDir = '.', {typescript, danger}) => {
    wrapCommand(swizzle)(
      path.resolve(siteDir),
      themeName,
      componentName,
      typescript,
      danger,
    );
  });

cli
  .command('deploy [siteDir]')
  .description('Deploy website to GitHub pages')
  .option(
    '-l, --locale <locale>',
    'Deploy the site in a specified locale. Deploy all known locales otherwise.',
  )
  .option(
    '--out-dir <dir>',
    'The full path for the new output directory, relative to the current workspace (default: build).',
  )
  .option(
    '--skip-build',
    'Skip building website before deploy it (default: false)',
  )
  .action((siteDir = '.', {outDir, skipBuild}) => {
    wrapCommand(deploy)(path.resolve(siteDir), {outDir, skipBuild});
  });

cli
  .command('start [siteDir]')
  .description('Start the development server')
  .option('-p, --port <port>', 'use specified port (default: 3000)')
  .option('-h, --host <host>', 'use specified host (default: localhost')
  .option('-l, --locale <locale>', 'use specified site locale')
  .option(
    '--hot-only',
    'Do not fallback to page refresh if hot reload fails (default: false)',
  )
  .option('--no-open', 'Do not open page in the browser (default: false)')
  .option(
    '--poll',
    'Use polling rather than watching for reload (default: false)',
  )
  .action((siteDir = '.', {port, host, locale, hotOnly, open, poll}) => {
    wrapCommand(start)(path.resolve(siteDir), {
      port,
      host,
      locale,
      hotOnly,
      open,
      poll,
    });
  });

cli
  .command('serve [siteDir]')
  .description('Serve website')
  .option(
    '--dir <dir>',
    'The full path for the new output directory, relative to the current workspace (default: build).',
  )
  .option('-p, --port <port>', 'use specified port (default: 3000)')
  .option('--build', 'Build website before serving (default: false)')
  .option('-h, --host <host>', 'use specified host (default: localhost')
  .action(
    (
      siteDir = '.',
      {
        dir = 'build',
        port = 3000,
        host = 'localhost',
        build: buildSite = false,
      },
    ) => {
      wrapCommand(serve)(path.resolve(siteDir), {
        dir,
        port,
        build: buildSite,
        host,
      });
    },
  );

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
