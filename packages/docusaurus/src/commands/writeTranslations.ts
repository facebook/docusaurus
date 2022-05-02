/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {ConfigOptions, InitializedPlugin} from '@docusaurus/types';
import path from 'path';
import {loadContext} from '../server';
import {initPlugins} from '../server/plugins/init';

import {
  writePluginTranslations,
  writeCodeTranslations,
  type WriteTranslationsOptions,
  getPluginsDefaultCodeTranslationMessages,
  applyDefaultCodeTranslations,
} from '../server/translations/translations';
import {
  extractSiteSourceCodeTranslations,
  globSourceCodeFilePaths,
} from '../server/translations/translationsExtractor';
import {getCustomBabelConfigFilePath, getBabelOptions} from '../webpack/utils';

/**
 * This is a hack, so that @docusaurus/theme-common translations are extracted!
 * A theme doesn't have a way to express that one of its dependency (like
 * @docusaurus/theme-common) also has translations to extract.
 * Instead of introducing a new lifecycle (like `getThemeTranslationPaths()`?)
 * We just make an exception and assume that user is using an official theme
 */
async function getExtraSourceCodeFilePaths(): Promise<string[]> {
  try {
    const themeCommonSourceDir = path.dirname(
      require.resolve('@docusaurus/theme-common/lib'),
    );
    return globSourceCodeFilePaths([themeCommonSourceDir]);
  } catch {
    return []; // User may not use a Docusaurus official theme? Quite unlikely...
  }
}

async function writePluginTranslationFiles({
  siteDir,
  plugin,
  locale,
  options,
}: {
  siteDir: string;
  plugin: InitializedPlugin;
  locale: string;
  options: WriteTranslationsOptions;
}) {
  if (plugin.getTranslationFiles) {
    const content = await plugin.loadContent?.();
    const translationFiles = await plugin.getTranslationFiles({
      content,
    });

    await Promise.all(
      translationFiles.map(async (translationFile) => {
        await writePluginTranslations({
          siteDir,
          plugin,
          translationFile,
          locale,
          options,
        });
      }),
    );
  }
}

export async function writeTranslations(
  siteDir: string,
  options: Partial<
    WriteTranslationsOptions & ConfigOptions & {locale?: string}
  >,
): Promise<void> {
  const context = await loadContext({
    siteDir,
    customConfigFilePath: options.config,
    locale: options.locale,
  });
  const plugins = await initPlugins(context);

  const locale = options.locale ?? context.i18n.defaultLocale;

  if (!context.i18n.locales.includes(locale)) {
    throw new Error(
      `Can't write-translation for locale "${locale}" that is not in the locale configuration file.
Available locales are: ${context.i18n.locales.join(',')}.`,
    );
  }

  const babelOptions = getBabelOptions({
    isServer: true,
    babelOptions: await getCustomBabelConfigFilePath(siteDir),
  });
  const extractedCodeTranslations = await extractSiteSourceCodeTranslations(
    siteDir,
    plugins,
    babelOptions,
    await getExtraSourceCodeFilePaths(),
  );
  const defaultCodeMessages = await getPluginsDefaultCodeTranslationMessages(
    plugins,
  );

  const codeTranslations = applyDefaultCodeTranslations({
    extractedCodeTranslations,
    defaultCodeMessages,
  });

  await writeCodeTranslations({siteDir, locale}, codeTranslations, options);

  await Promise.all(
    plugins.map(async (plugin) => {
      await writePluginTranslationFiles({siteDir, plugin, locale, options});
    }),
  );
}
