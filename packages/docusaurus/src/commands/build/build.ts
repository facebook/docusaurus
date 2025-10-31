/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import logger, {PerfLogger} from '@docusaurus/logger';
import {mapAsyncSequential} from '@docusaurus/utils';
import {loadContext, type LoadContextParams} from '../../server/site';
import {loadI18n} from '../../server/i18n';
import {buildLocale, type BuildLocaleParams} from './buildLocale';
import {isAutomaticBaseUrlLocalizationDisabled} from './buildUtils';

export type BuildCLIOptions = Pick<LoadContextParams, 'config' | 'outDir'> & {
  locale?: [string, ...string[]];
  bundleAnalyzer?: boolean;
  minify?: boolean;
  dev?: boolean;
};

export async function build(
  siteDirParam: string = '.',
  cliOptions: Partial<BuildCLIOptions> = {},
): Promise<void> {
  process.env.BABEL_ENV = 'production';
  process.env.NODE_ENV = 'production';
  if (cliOptions.dev) {
    logger.info`Building in dev mode`;
    process.env.BABEL_ENV = 'development';
    process.env.NODE_ENV = 'development';
  }

  const siteDir = await fs.realpath(siteDirParam);

  ['SIGINT', 'SIGTERM'].forEach((sig) => {
    process.on(sig, () => process.exit());
  });

  const locales = await PerfLogger.async('Get locales to build', () =>
    getLocalesToBuild({siteDir, cliOptions}),
  );

  if (locales.length > 1) {
    logger.info`Website will be built for all these locales: ${locales}`;
  }

  await PerfLogger.async(`Build`, () =>
    mapAsyncSequential(locales, async (locale) => {
      await tryToBuildLocale({siteDir, locale, cliOptions});
    }),
  );

  logger.info`Use code=${'npm run serve'} command to test your build locally.`;
}

// We need the default locale to always be the 1st in the list. If we build it
// last, it would "erase" the localized sites built in sub-folders
function orderLocales({
  locales,
  defaultLocale,
}: {
  locales: [string, ...string[]];
  defaultLocale: string;
}): [string, ...string[]] {
  if (locales.includes(defaultLocale)) {
    return [
      defaultLocale,
      ...locales.filter((locale) => locale !== defaultLocale),
    ];
  } else {
    return locales;
  }
}

async function getLocalesToBuild({
  siteDir,
  cliOptions,
}: {
  siteDir: string;
  cliOptions: BuildCLIOptions;
}): Promise<[string, ...string[]]> {
  // TODO we shouldn't need to load all context + i18n just to get that list
  // only loading siteConfig should be enough
  const context = await loadContext({
    siteDir,
    outDir: cliOptions.outDir,
    config: cliOptions.config,
    automaticBaseUrlLocalizationDisabled: isAutomaticBaseUrlLocalizationDisabled(cliOptions),
  });

  const i18n = await loadI18n({
    siteDir,
    config: context.siteConfig,
    currentLocale: context.siteConfig.i18n.defaultLocale, // Awkward but ok
    automaticBaseUrlLocalizationDisabled: false,
  });

  const locales = cliOptions.locale ?? i18n.locales;

  return orderLocales({
    locales: locales as [string, ...string[]],
    defaultLocale: i18n.defaultLocale,
  });
}

async function tryToBuildLocale(params: BuildLocaleParams) {
  try {
    await PerfLogger.async(`${logger.name(params.locale)}`, async () => {
      // Note: I tried to run buildLocale in worker_threads (still sequentially)
      // It didn't work and I got SIGSEGV / SIGBUS errors
      // See https://x.com/sebastienlorber/status/1848413716372480338
      await runBuildLocaleTask(params);
    });
  } catch (err) {
    throw new Error(
      logger.interpolate`Unable to build website for locale name=${params.locale}.`,
      {
        cause: err,
      },
    );
  }
}

async function runBuildLocaleTask(params: BuildLocaleParams) {
  // Note: I tried to run buildLocale task in worker_threads (sequentially)
  // It didn't work and I got SIGSEGV / SIGBUS errors
  // Goal was to isolate memory of each localized site build
  // See also https://x.com/sebastienlorber/status/1848413716372480338
  //
  // Running in child_process worked but is more complex and requires
  // specifying the memory of the child process + weird logging issues to fix
  //
  // Note in the future we could try to enable concurrent localized site builds
  await buildLocale(params);
}
