#!/usr/bin/env node
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// @ts-check

import logger from '@docusaurus/logger';
import cli from 'commander';
import {DOCUSAURUS_VERSION} from '@docusaurus/utils';
import {
  build,
  swizzle,
  deploy,
  start,
  externalCommand,
  serve,
  clear,
  writeTranslations,
  writeHeadingIds,
} from '../lib/index.js';
import beforeCli from './beforeCli.mjs';

// Env variables are initialized to dev, but can be overridden by each command
// For example, "docusaurus build" overrides them to "production"
// See also https://github.com/facebook/docusaurus/issues/8599
process.env.BABEL_ENV ??= 'development';
process.env.NODE_ENV ??= 'development';

await beforeCli();

cli.version(DOCUSAURUS_VERSION).usage('<command> [options]');

cli
  .command('build [siteDir]')
  .description('Build website.')
  .option(
    '--dev',
    'Builds the website in dev mode, including full React error messages.',
  )
  .option(
    '--bundle-analyzer',
    'visualize size of webpack output files with an interactive zoomable tree map (default: false)',
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
  // @ts-expect-error: Promise<string> is not assignable to Promise<void>... but
  // good enough here.
  .action(build);

cli
  .command('swizzle [themeName] [componentName] [siteDir]')
  .description(
    'Wraps or ejects the original theme files into website folder for customization.',
  )
  .option(
    '-w, --wrap',
    'Creates a wrapper around the original theme component.\nAllows rendering other components before/after the original theme component.',
  )
  .option(
    '-e, --eject',
    'Ejects the full source code of the original theme component.\nAllows overriding the original component entirely with your own UI and logic.',
  )
  .option(
    '-l, --list',
    'only list the available themes/components without further prompting (default: false)',
  )
  .option(
    '-t, --typescript',
    'copy TypeScript theme files when possible (default: false)',
  )
  .option('--danger', 'enable swizzle for unsafe component of themes')
  .option(
    '--config <config>',
    'path to Docusaurus config file (default: `[siteDir]/docusaurus.config.js`)',
  )
  .action(swizzle);

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
  .action(deploy);

/**
 * @param {string | undefined} value
 * @returns {boolean | number}
 */
function normalizePollValue(value) {
  if (value === undefined || value === '') {
    return false;
  }

  const parsedIntValue = Number.parseInt(value, 10);
  if (!Number.isNaN(parsedIntValue)) {
    return parsedIntValue;
  }

  return value === 'true';
}

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
    normalizePollValue,
  )
  .option(
    '--no-minify',
    'build website without minimizing JS bundles (default: false)',
  )
  .action(start);

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
  .option(
    '--no-open',
    'do not open page in the browser (default: false, or true in CI)',
  )
  .action(serve);

cli
  .command('clear [siteDir]')
  .description('Remove build artifacts.')
  .action(clear);

cli
  .command('write-translations [siteDir]')
  .description('Extract required translations of your site.')
  .option(
    '-l, --locale <locale>',
    'the locale folder to write the translations.\n"--locale fr" will write translations in the ./i18n/fr folder.',
  )
  .option(
    '--override',
    'By default, we only append missing translation messages to existing translation files. This option allows to override existing translation messages. Make sure to commit or backup your existing translations, as they may be overridden. (default: false)',
  )
  .option(
    '--config <config>',
    'path to Docusaurus config file (default:`[siteDir]/docusaurus.config.js`)',
  )
  .option(
    '--messagePrefix <messagePrefix>',
    'Allows to init new written messages with a given prefix. This might help you to highlight untranslated message by making them stand out in the UI (default: "")',
  )
  .action(writeTranslations);

cli
  .command('write-heading-ids [siteDir] [files...]')
  .description('Generate heading ids in Markdown content.')
  .option(
    '--maintain-case',
    "keep the headings' casing, otherwise make all lowercase (default: false)",
  )
  .option('--overwrite', 'overwrite existing heading IDs (default: false)')
  .action(writeHeadingIds);

cli.arguments('<command>').action((cmd) => {
  cli.outputHelp();
  logger.error`    Unknown command name=${cmd}.`;
});

/**
 * @param {string | undefined} command
 */
function isInternalCommand(command) {
  return (
    command &&
    [
      'start',
      'build',
      'swizzle',
      'deploy',
      'serve',
      'clear',
      'write-translations',
      'write-heading-ids',
    ].includes(command)
  );
}

if (!isInternalCommand(process.argv.slice(2)[0])) {
  await externalCommand(cli);
}

if (!process.argv.slice(2).length) {
  cli.outputHelp();
}

cli.parse(process.argv);

process.on('unhandledRejection', (err) => {
  console.log('');
  // Do not use logger.error here: it does not print error causes
  console.error(err);
  console.log('');

  logger.info`Docusaurus version: number=${DOCUSAURUS_VERSION}
Node version: number=${process.version}`;
  process.exit(1);
});
