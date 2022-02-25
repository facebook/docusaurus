#!/usr/bin/env node
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// @ts-check

import logger from '@docusaurus/logger';
import fs from 'fs-extra';
import cli from 'commander';
import {createRequire} from 'module';
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

await beforeCli();

const resolveDir = (dir = '.') => fs.realpath(dir);

cli
  .version(createRequire(import.meta.url)('../package.json').version)
  .usage('<command> [options]');

cli
  .command('build [siteDir]')
  .description('Build website.')
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
  .action(async (siteDir, {bundleAnalyzer, config, outDir, locale, minify}) => {
    build(await resolveDir(siteDir), {
      bundleAnalyzer,
      outDir,
      config,
      locale,
      minify,
    });
  });

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
  .action(async (themeName, componentName, siteDir, options) => {
    swizzle(await resolveDir(siteDir), themeName, componentName, options);
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
  .action(async (siteDir, {outDir, skipBuild, config}) => {
    deploy(await resolveDir(siteDir), {
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
  .action(
    async (siteDir, {port, host, locale, config, hotOnly, open, poll}) => {
      start(await resolveDir(siteDir), {
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
    async (
      siteDir,
      {
        dir = 'build',
        port = 3000,
        host = 'localhost',
        build: buildSite = false,
        config,
      },
    ) => {
      serve(await resolveDir(siteDir), {
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
  .action(async (siteDir) => {
    clear(await resolveDir(siteDir));
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
    async (
      siteDir,
      {locale = undefined, override = false, messagePrefix = '', config},
    ) => {
      writeTranslations(await resolveDir(siteDir), {
        locale,
        override,
        config,
        messagePrefix,
      });
    },
  );

cli
  .command('write-heading-ids [siteDir] [files...]')
  .description('Generate heading ids in Markdown content.')
  .option(
    '--maintain-case',
    "keep the headings' casing, otherwise make all lowercase (default: false)",
  )
  .option('--overwrite', 'overwrite existing heading IDs (default: false)')
  .action(async (siteDir, files, options) =>
    writeHeadingIds(await resolveDir(siteDir), files, options),
  );

cli.arguments('<command>').action((cmd) => {
  cli.outputHelp();
  logger.error`    Unknown command name=${cmd}.`;
});

/**
 * @param {string} command
 */
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
    await externalCommand(cli, await resolveDir('.'));
  }

  cli.parse(process.argv);

  if (!process.argv.slice(2).length) {
    cli.outputHelp();
  }
}

run();

process.on('unhandledRejection', (err) => {
  logger.error(err);
  process.exit(1);
});
