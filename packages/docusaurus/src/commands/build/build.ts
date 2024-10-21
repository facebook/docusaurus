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
import {buildLocale} from './buildLocale';

export type BuildCLIOptions = Pick<
  LoadContextParams,
  'config' | 'locale' | 'outDir'
> & {
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
  process.env.DOCUSAURUS_CURRENT_LOCALE = cliOptions.locale;
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

async function getLocalesToBuild({
  siteDir,
  cliOptions,
}: {
  siteDir: string;
  cliOptions: BuildCLIOptions;
}): Promise<[string, ...string[]]> {
  if (cliOptions.locale) {
    return [cliOptions.locale];
  }

  const context = await loadContext({
    siteDir,
    outDir: cliOptions.outDir,
    config: cliOptions.config,
    locale: cliOptions.locale,
    localizePath: cliOptions.locale ? false : undefined,
  });
  const i18n = await loadI18n(context.siteConfig, {
    locale: cliOptions.locale,
  });
  if (i18n.locales.length > 1) {
    logger.info`Website will be built for all these locales: ${i18n.locales}`;
  }

  // We need the default locale to always be the 1st in the list. If we build it
  // last, it would "erase" the localized sites built in sub-folders
  return [
    i18n.defaultLocale,
    ...i18n.locales.filter((locale) => locale !== i18n.defaultLocale),
  ];
}

async function tryToBuildLocale({
  siteDir,
  locale,
  cliOptions,
}: {
  siteDir: string;
  locale: string;
  cliOptions: BuildCLIOptions;
}) {
  try {
    await PerfLogger.async(`${logger.name(locale)}`, async () => {
      await buildLocale({
        siteDir,
        locale,
        cliOptions,
      });
    });
  } catch (err) {
    throw new Error(
      logger.interpolate`Unable to build website for locale name=${locale}.`,
      {
        cause: err,
      },
    );
  }
}
