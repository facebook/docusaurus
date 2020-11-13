/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import {loadContext, loadPluginConfigs} from '../server';
import initPlugins, {InitPlugin} from '../server/plugins/init';

import {
  writePluginTranslations,
  writeCodeTranslations,
} from '../translations/translations';
import {extractPluginsSourceCodeTranslations} from '../translations/translationsExtractor';
import {getCustomBabelConfigFilePath, getBabelOptions} from '../webpack/utils';
import {difference} from 'lodash';

async function writePluginTranslationFiles({
  siteDir,
  plugin,
  locales,
}: {
  siteDir: string;
  plugin: InitPlugin;
  locales: string[];
}) {
  if (plugin.getTranslationFiles) {
    const translationFiles = await plugin.getTranslationFiles();

    await Promise.all(
      translationFiles.map(async (translationFile) => {
        await Promise.all(
          locales.map((locale) =>
            writePluginTranslations({
              siteDir,
              plugin,
              translationFile,
              locale,
            }),
          ),
        );
      }),
    );
  }
}

export default async function writeTranslations(
  siteDir: string,
  options: {locales?: string[]},
): Promise<void> {
  const context = await loadContext(siteDir);
  const pluginConfigs = loadPluginConfigs(context);
  const plugins = initPlugins({
    pluginConfigs,
    context,
  });

  function getLocalesToWrite(): string[] {
    if (options.locales?.length === 1 && options.locales[0] === 'all') {
      return context.i18n.locales;
    } else if (options.locales) {
      const unknownLocales = difference(options.locales, context.i18n.locales);
      if (unknownLocales.length > 0) {
        throw new Error(
          `Can't write-translation for locales that are not in the locale configuration file. Unknown locales=${unknownLocales.join(
            ',',
          )}`,
        );
      }
      return options.locales;
    } else {
      return [context.i18n.defaultLocale];
    }
  }

  const locales = getLocalesToWrite();

  const babelOptions = getBabelOptions({
    isServer: true,
    babelOptions: getCustomBabelConfigFilePath(siteDir),
  });
  const codeTranslations = await extractPluginsSourceCodeTranslations(
    plugins,
    babelOptions,
  );
  await Promise.all(
    locales.map((locale) =>
      writeCodeTranslations({siteDir, locale}, codeTranslations),
    ),
  );

  await Promise.all(
    plugins.map(async (plugin) => {
      await writePluginTranslationFiles({siteDir, plugin, locales});
    }),
  );
}
