/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import path from 'path';
import fs from 'fs-extra';
import {InitPlugin} from './plugins/init';

// should we make this configurable?
export function getTranslationsDirPath(siteDir: string) {
  return path.resolve(path.join(siteDir, `i18n`));
}
export function getTranslationsLocaleDirPath(siteDir: string, locale: string) {
  return path.join(getTranslationsDirPath(siteDir), locale);
}

export function getTranslationsFilePath(siteDir: string, locale: string) {
  return path.join(
    getTranslationsLocaleDirPath(siteDir, locale),
    'translations.json',
  );
}

export async function writeTranslationsFile({
  siteDir,
  locale,
  translations,
}: {
  siteDir: string;
  locale: string;
  translations: Record<string, unknown>;
}) {
  await fs.ensureDir(getTranslationsLocaleDirPath(siteDir, locale));
  const translationsFilePath = getTranslationsFilePath(siteDir, locale);
  await fs.writeFile(
    translationsFilePath,
    JSON.stringify(translations, null, 2),
  );
  return translationsFilePath;
}

export async function readTranslationsFile({
  siteDir,
  locale,
}: {
  siteDir: string;
  locale: string;
}) {
  const translationsFilePath = getTranslationsFilePath(siteDir, locale);
  if (await fs.stat(translationsFilePath)) {
    return JSON.parse(
      await fs.readFile(translationsFilePath, 'utf8'),
    ) as Record<string, unknown>;
  }
  return {};
}

export function collectPluginTranslation(
  plugins: InitPlugin[],
): Record<string, Record<string, unknown>> {
  const pluginTranslations = {};
  plugins.forEach((plugin) => {
    if (plugin.getTranslations) {
      pluginTranslations[plugin.name] = pluginTranslations[plugin.name] ?? {};
      pluginTranslations[plugin.name][
        plugin.options.id
      ] = plugin.getTranslations();
    }
  });
  return pluginTranslations;
}
