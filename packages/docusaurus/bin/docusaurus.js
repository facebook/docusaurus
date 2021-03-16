#!/usr/bin/env node

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const chalk = require('chalk');
const fs = require('fs-extra');
const semver = require('semver');
const path = require('path');
const cli = require('commander');
const updateNotifier = require('update-notifier');
const boxen = require('boxen');
const {
  build,
  swizzle,
  deploy,
  start,
  externalCommand,
  serve,
  clear,
  writeTranslations,
  writeHeadingIds,
} = require('../lib');
const {
  name,
  version,
  engines: {node: requiredVersion},
} = require('../package.json');

// notify user if @docusaurus packages is outdated
const notifier = updateNotifier({
  pkg: {
    name,
    version,
  },
});

// allow the user to be notified for updates on the first run
if (notifier.lastUpdateCheck === Date.now()) {
  notifier.lastUpdateCheck = 0;
}

if (notifier.update && notifier.update.current !== notifier.update.latest) {
  // eslint-disable-next-line import/no-dynamic-require, global-require
  const sitePkg = require(path.resolve(process.cwd(), 'package.json'));
  const siteDocusaurusPackagesForUpdate = Object.keys(sitePkg.dependencies)
    .filter((p) => p.startsWith('@docusaurus'))
    .map((p) => p.concat('@latest'))
    .join(' ');
  const isYarnUsed = fs.existsSync(path.resolve(process.cwd(), 'yarn.lock'));
  const upgradeCommand = isYarnUsed
    ? `yarn upgrade ${siteDocusaurusPackagesForUpdate}`
    : `npm i ${siteDocusaurusPackagesForUpdate}`;

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
    )}${chalk.green(
      `${notifier.update.latest}`,
    )}\n\nTo upgrade Docusaurus packages with the latest version, run the following command:\n${chalk.cyan(
      `${upgradeCommand}`,
    )}`,
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
    '--config <config>',
    'Path to docusaurus config file, default to `[siteDir]/docusaurus.config.js`',
  )
  .option(
    '-l, --locale <locale>',
    'Build the site in a specified locale. Build all known locales otherwise.',
  )
  .option(
    '--no-minify',
    'Build website without minimizing JS bundles (default: false)',
  )
  .action((siteDir = '.', {bundleAnalyzer, config, outDir, locale, minify}) => {
    wrapCommand(build)(path.resolve(siteDir), {
      bundleAnalyzer,
      outDir,
      config,
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
    '--config <config>',
    'Path to docusaurus config file, default to `[siteDir]/docusaurus.config.js`',
  )
  .option(
    '--skip-build',
    'Skip building website before deploy it (default: false)',
  )
  .action((siteDir = '.', {outDir, skipBuild, config}) => {
    wrapCommand(deploy)(path.resolve(siteDir), {
      outDir,
      config,
      skipBuild,
    });
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
  .option(
    '--config <config>',
    'Path to docusaurus config file, default to `[siteDir]/docusaurus.config.js`',
  )
  .option('--no-open', 'Do not open page in the browser (default: false)')
  .option(
    '--poll [interval]',
    'Use polling rather than watching for reload (default: false). Can specify a poll interval in milliseconds.',
  )
  .action(
    (siteDir = '.', {port, host, locale, config, hotOnly, open, poll}) => {
      wrapCommand(start)(path.resolve(siteDir), {
        port,
        host,
        locale,
        config,
        hotOnly,
        open,
        poll,
      });
    },
  );

cli
  .command('serve [siteDir]')
  .description('Serve website')
  .option(
    '--dir <dir>',
    'The full path for the new output directory, relative to the current workspace (default: build).',
  )
  .option(
    '--config <config>',
    'Path to docusaurus config file, default to `[siteDir]/docusaurus.config.js`',
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
        config,
      },
    ) => {
      wrapCommand(serve)(path.resolve(siteDir), {
        dir,
        port,
        build: buildSite,
        config,
        host,
      });
    },
  );

cli
  .command('clear [siteDir]')
  .description('Remove build artifacts')
  .action((siteDir = '.') => {
    wrapCommand(clear)(path.resolve(siteDir));
  });

cli
  .command('write-translations [siteDir]')
  .description('Extract required translations of your site')
  .option(
    '-l, --locale <locale>',
    'The locale folder to write the translations\n"--locale fr" will write translations in ./i18n/fr folder)',
  )
  .option(
    '--override',
    'By default, we only append missing translation messages to existing translation files. This option allows to override existing translation messages. Make sure to commit or backup your existing translations, as they may be overridden.',
  )
  .option(
    '--config <config>',
    'Path to docusaurus config file, default to `[siteDir]/docusaurus.config.js`',
  )
  .option(
    '--messagePrefix <messagePrefix>',
    'Allows to init new written messages with a given prefix. This might help you to highlight untranslated message to make them stand out in the UI.',
  )
  .action(
    (
      siteDir = '.',
      {locale = undefined, override = false, messagePrefix = '', config},
    ) => {
      wrapCommand(writeTranslations)(path.resolve(siteDir), {
        locale,
        override,
        config,
        messagePrefix,
      });
    },
  );

cli
  .command('write-heading-ids [contentDir]')
  .description('Generate heading ids in Markdown content')
  .action((siteDir = '.') => {
    wrapCommand(writeHeadingIds)(siteDir);
  });

cli.arguments('<command>').action((cmd) => {
  cli.outputHelp();
  console.log(`  ${chalk.red(`\n  Unknown command ${chalk.yellow(cmd)}.`)}`);
  console.log();
});

function isInternalCommand(command) {
  return [
    'start',
    'build',
    'swizzle',
    'deploy',
    'serve',
    'clear',
    'write-translations',
    'write-heading-ids',
  ].includes(command);
}

async function run() {
  if (!isInternalCommand(process.argv.slice(2)[0])) {
    await externalCommand(cli, path.resolve('.'));
  }

  cli.parse(process.argv);

  if (!process.argv.slice(2).length) {
    cli.outputHelp();
  }
}

run();
