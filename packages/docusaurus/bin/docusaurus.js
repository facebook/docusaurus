#!/usr/bin/env node
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// @ts-check

const logger = require('@docusaurus/logger').default;
const fs = require('fs');
const cli = require('commander');
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

require('./beforeCli');

const resolveDir = (dir = '.') => fs.realpathSync(dir);

cli.version(require('../package.json').version).usage('<command> [options]');

cli
  .command('build [siteDir]')
  .description('Build website.')
  .option(
    '--bundle-analyzer',
    'visualize size of webpack output files with an interactive zoomable treemap (default: false)',
  )
  .option(
    '--out-dir <dir>',
    'the full path for the new output directory, relative to the current workspace (default: build)',
  )
  .option(
    '--config <config>',
    'path to docusaurus config file (default: `[siteDir]/docusaurus.config.js`)',
  )
  .option(
    '-l, --locale <locale>',
    'build the site in a specified locale. Build all known locales otherwise',
  )
  .option(
    '--no-minify',
    'build website without minimizing JS bundles (default: false)',
  )
  .action((siteDir, {bundleAnalyzer, config, outDir, locale, minify}) => {
    build(resolveDir(siteDir), {
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
    'copy TypeScript theme files when possible (default: false)',
  )
  .option('--danger', 'enable swizzle for internal component of themes')
  .action((themeName, componentName, siteDir, {typescript, danger}) => {
    swizzle(resolveDir(siteDir), themeName, componentName, typescript, danger);
  });

cli
  .command('deploy [siteDir]')
  .description('Deploy website to GitHub pages.')
  .option(
    '-l, --locale <locale>',
    'deploy the site in a specified locale. Deploy all known locales otherwise',
  )
  .option(
    '--out-dir <dir>',
    'the full path for the new output directory, relative to the current workspace (default: build)',
  )
  .option(
    '--config <config>',
    'path to Docusaurus config file (default: `[siteDir]/docusaurus.config.js`)',
  )
  .option(
    '--skip-build',
    'skip building website before deploy it (default: false)',
  )
  .action((siteDir, {outDir, skipBuild, config}) => {
    deploy(resolveDir(siteDir), {
      outDir,
      config,
      skipBuild,
    });
  });

cli
  .command('start [siteDir]')
  .description('Start the development server.')
  .option('-p, --port <port>', 'use specified port (default: 3000)')
  .option('-h, --host <host>', 'use specified host (default: localhost)')
  .option('-l, --locale <locale>', 'use specified site locale')
  .option(
    '--hot-only',
    'do not fallback to page refresh if hot reload fails (default: false)',
  )
  .option(
    '--config <config>',
    'path to Docusaurus config file (default: `[siteDir]/docusaurus.config.js`)',
  )
  .option('--no-open', 'do not open page in the browser (default: false)')
  .option(
    '--poll [interval]',
    'use polling rather than watching for reload (default: false). Can specify a poll interval in milliseconds',
  )
  .action((siteDir, {port, host, locale, config, hotOnly, open, poll}) => {
    start(resolveDir(siteDir), {
      port,
      host,
      locale,
      config,
      hotOnly,
      open,
      poll,
    });
  });

cli
  .command('serve [siteDir]')
  .description('Serve website locally.')
  .option(
    '--dir <dir>',
    'the full path for the new output directory, relative to the current workspace (default: build)',
  )
  .option(
    '--config <config>',
    'path to Docusaurus config file (default: `[siteDir]/docusaurus.config.js`)',
  )
  .option('-p, --port <port>', 'use specified port (default: 3000)')
  .option('--build', 'build website before serving (default: false)')
  .option('-h, --host <host>', 'use specified host (default: localhost)')
  .action(
    (
      siteDir,
      {
        dir = 'build',
        port = 3000,
        host = 'localhost',
        build: buildSite = false,
        config,
      },
    ) => {
      serve(resolveDir(siteDir), {
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
  .description('Remove build artifacts.')
  .action((siteDir) => {
    clear(resolveDir(siteDir));
  });

cli
  .command('write-translations [siteDir]')
  .description('Extract required translations of your site.')
  .option(
    '-l, --locale <locale>',
    'the locale folder to write the translations\n"--locale fr" will write translations in ./i18n/fr folder)',
  )
  .option(
    '--override',
    'by default, we only append missing translation messages to existing translation files. This option allows to override existing translation messages. Make sure to commit or backup your existing translations, as they may be overridden',
  )
  .option(
    '--config <config>',
    'path to Docusaurus config file (default:`[siteDir]/docusaurus.config.js`)',
  )
  .option(
    '--messagePrefix <messagePrefix>',
    'allows to init new written messages with a given prefix. This might help you to highlight untranslated message to make them stand out in the UI',
  )
  .action(
    (
      siteDir,
      {locale = undefined, override = false, messagePrefix = '', config},
    ) => {
      writeTranslations(resolveDir(siteDir), {
        locale,
        override,
        config,
        messagePrefix,
      });
    },
  );

cli
  .command('write-heading-ids [contentDir] [files]')
  .description('Generate heading ids in Markdown content.')
  .option(
    '--maintain-case',
    "keep the headings' casing, otherwise make all lowercase (default: false)",
  )
  .option('--overwrite', 'overwrite existing heading IDs (default: false)')
  .action((siteDir, files, options) =>
    writeHeadingIds(resolveDir(siteDir), files, options),
  );

cli.arguments('<command>').action((cmd) => {
  cli.outputHelp();
  logger.error`    Unknown command name=${cmd}.`;
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
    // @ts-expect-error: Hmmm
    await externalCommand(cli, resolveDir('.'));
  }

  cli.parse(process.argv);

  if (!process.argv.slice(2).length) {
    cli.outputHelp();
  }
}

run();

process.on('unhandledRejection', (err) => {
  logger.error(err.stack);
  process.exit(1);
});
