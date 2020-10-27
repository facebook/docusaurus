/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import path from 'path';
import fs from 'fs-extra';
import {InitPlugin} from './plugins/init';
import {
  DocusaurusI18nTranslations,
  DocusaurusI18nPluginTranslations,
} from '@docusaurus/types';
import {flatten} from 'lodash';
import globby from 'globby';

// should we make this configurable?
export function getTranslationsDirPath(siteDir: string): string {
  return path.resolve(path.join(siteDir, `i18n`));
}
export function getTranslationsLocaleDirPath(
  siteDir: string,
  locale: string,
): string {
  return path.join(getTranslationsDirPath(siteDir), locale);
}

export function getTranslationsFilePath(
  siteDir: string,
  locale: string,
): string {
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
  translations: DocusaurusI18nTranslations;
}): Promise<string> {
  await fs.ensureDir(getTranslationsLocaleDirPath(siteDir, locale));
  const translationsFilePath = getTranslationsFilePath(siteDir, locale);
  await fs.writeFile(
    translationsFilePath,
    JSON.stringify(translations, null, 2),
  );
  return translationsFilePath;
}

function isValidTranslationsFile(
  content: any,
): content is DocusaurusI18nTranslations {
  return (
    typeof content.plugins === 'object' && typeof content.pages === 'object'
  );
}

export async function readTranslationsFile({
  siteDir,
  locale,
}: {
  siteDir: string;
  locale: string;
}): Promise<DocusaurusI18nTranslations> {
  const translationsFilePath = getTranslationsFilePath(siteDir, locale);
  if (await fs.pathExists(translationsFilePath)) {
    const translationsFile = JSON.parse(
      await fs.readFile(translationsFilePath, 'utf8'),
    );
    if (isValidTranslationsFile(translationsFile)) {
      return translationsFile;
    } else {
      throw new Error(
        `File at path=${translationsFilePath} does not look like a valid Docusaurus translation file`,
      );
    }
  }
  return {plugins: {}, extracted: {}};
}

export async function collectPluginTranslations(
  plugins: InitPlugin[],
): Promise<DocusaurusI18nPluginTranslations> {
  const pluginsTranslations = await Promise.all(
    plugins.map((plugin) => {
      return plugin.getTranslations ? plugin.getTranslations() : null;
    }),
  );

  const translations = {};
  plugins.forEach((plugin, index) => {
    const pluginTranslations = pluginsTranslations[index];
    if (pluginTranslations) {
      translations[plugin.name] = translations[plugin.name] ?? {};
      translations[plugin.name][plugin.options.id] = pluginTranslations;
    }
  });

  return translations;
}

// We only support extracting source code translations from these kind of files
const TranslatableSourceCodeExtension = new Set([
  '.js',
  '.jsx',
  '.ts',
  '.tsx',
  // TODO support md/mdx translation extraction
  // '.md',
  // '.mdx',
]);
function isTranslatableSourceCodePath(filePath: string): boolean {
  return TranslatableSourceCodeExtension.has(path.extname(filePath));
}

export async function collectPluginTranslationSourceCodeFilePaths(
  plugins: InitPlugin[],
): Promise<string[]> {
  // The getPathsToWatch() generally returns the js/jsx/ts/tsx/md/mdx file paths
  // We can use this method as well to know which folders we should try to extract translations from
  // Hacky/implicit, but do we want to introduce a new lifecycle method for that???
  const allPathsToWatch = flatten(
    plugins.map((plugin) => plugin.getPathsToWatch?.() ?? []),
  );

  const filePaths = await globby(allPathsToWatch);

  return filePaths.filter(isTranslatableSourceCodePath);
}
