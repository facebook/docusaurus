/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import {loadContext, loadPluginConfigs} from '../server';
import initPlugins, {InitPlugin} from '../server/plugins/init';

import {
  appendPluginTranslations,
  appendCodeTranslations,
} from '../translations/translations';
import {extractPluginsSourceCodeTranslations} from '../translations/translationsExtractor';
import {getCustomBabelConfigFilePath, getBabelOptions} from '../webpack/utils';

async function appendPluginTranslationFiles({
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
            appendPluginTranslations({
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
): Promise<void> {
  const context = await loadContext(siteDir);
  const pluginConfigs = loadPluginConfigs(context);
  const plugins = initPlugins({
    pluginConfigs,
    context,
  });

  // TODO make this configurable with cli???
  const allLocales = false;

  const locales = allLocales
    ? context.i18n.context.locales
    : [context.i18n.context.defaultLocale];

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
      appendCodeTranslations({siteDir, locale}, codeTranslations),
    ),
  );

  await Promise.all(
    plugins.map(async (plugin) => {
      await appendPluginTranslationFiles({siteDir, plugin, locales});
    }),
  );
}
