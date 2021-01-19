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
  WriteTranslationsOptions,
} from '../server/translations/translations';
import {extractPluginsSourceCodeTranslations} from '../server/translations/translationsExtractor';
import {getCustomBabelConfigFilePath, getBabelOptions} from '../webpack/utils';

async function writePluginTranslationFiles({
  siteDir,
  plugin,
  locale,
  options,
}: {
  siteDir: string;
  plugin: InitPlugin;
  locale: string;
  options: WriteTranslationsOptions;
}) {
  if (plugin.getTranslationFiles) {
    const translationFiles = await plugin.getTranslationFiles();

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

export default async function writeTranslations(
  siteDir: string,
  options: WriteTranslationsOptions & {locale?: string},
): Promise<void> {
  const context = await loadContext(siteDir);
  const pluginConfigs = loadPluginConfigs(context);
  const plugins = initPlugins({
    pluginConfigs,
    context,
  });

  const locale = options.locale ?? context.i18n.defaultLocale;

  if (!context.i18n.locales.includes(locale)) {
    throw new Error(
      `Can't write-translation for locale that is not in the locale configuration file.
Unknown locale=[${locale}].
Available locales=[${context.i18n.locales.join(',')}]`,
    );
  }

  const babelOptions = getBabelOptions({
    isServer: true,
    babelOptions: getCustomBabelConfigFilePath(siteDir),
  });
  const codeTranslations = await extractPluginsSourceCodeTranslations(
    plugins,
    babelOptions,
  );
  await writeCodeTranslations({siteDir, locale}, codeTranslations, options);

  await Promise.all(
    plugins.map(async (plugin) => {
      await writePluginTranslationFiles({siteDir, plugin, locale, options});
    }),
  );
}
