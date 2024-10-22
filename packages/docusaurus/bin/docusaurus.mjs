#!/usr/bin/env node
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// @ts-check

import {inspect} from 'node:util';
import {logger} from '@docusaurus/logger';
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

/**
 * @param {string} locale
 * @param {string[]} locales
 * @returns {string[]}
 */
function concatLocaleOptions(locale, locales = []) {
  return locales.concat(locale);
}

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
    '-l, --locale <locale...>',
    'build the site in the specified locale(s). Build all known locales otherwise',
    concatLocaleOptions,
  )
  .option(
    '--no-minify',
    'build website without minimizing JS bundles (default: false)',
  )
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
  .option(
    '-j, --javascript',
    'copy JavaScript theme files when possible (default: false)',
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
    'deploy the site in the specified locale(s). Deploy all known locales otherwise',
    concatLocaleOptions,
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
  .option(
    '--target-dir <dir>',
    'path to the target directory to deploy to (default: `.`)',
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
  logger.error`Unknown Docusaurus CLI command name=${cmd}.`;
  process.exit(1);
});

// === The above is the commander configuration ===
// They don't start any code execution yet until cli.parse() is called below

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

/**
 * @param {string | undefined} command
 */
function isExternalCommand(command) {
  return !!(command && !isInternalCommand(command) && !command.startsWith('-'));
}

// No command? We print the help message because Commander doesn't
// Note argv looks like this: ['../node','../docusaurus.mjs','<command>',...rest]
if (process.argv.length < 3) {
  cli.outputHelp();
  logger.error`Please provide a Docusaurus CLI command.`;
  process.exit(1);
}

// There is an unrecognized subcommand
// Let plugins extend the CLI before parsing
if (isExternalCommand(process.argv[2])) {
  // TODO: in this step, we must assume default site structure because there's
  // no way to know the siteDir/config yet. Maybe the root cli should be
  // responsible for parsing these arguments?
  // https://github.com/facebook/docusaurus/issues/8903
  await externalCommand(cli);
}

cli.parse(process.argv);

process.on('unhandledRejection', (err) => {
  console.log('');

  // We need to use inspect with increased depth to log the full causal chain
  // By default Node logging has depth=2
  // see also https://github.com/nodejs/node/issues/51637
  logger.error(inspect(err, {depth: Infinity}));

  logger.info`Docusaurus version: number=${DOCUSAURUS_VERSION}
Node version: number=${process.version}`;
  process.exit(1);
});
