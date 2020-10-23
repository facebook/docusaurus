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
  DocusaurusI18nPagesTranslations,
} from '@docusaurus/types';
import {getBabelOptions, getCustomBabelConfigFilePath} from '../webpack/utils';

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
  if (await fs.stat(translationsFilePath)) {
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
  return {plugins: {}, pages: {}};
}

export function collectPluginTranslations(
  plugins: InitPlugin[],
): DocusaurusI18nPluginTranslations {
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

export async function collectPageTranslations(
  siteDir: string,
): Promise<DocusaurusI18nPagesTranslations> {
  const code = await fs.readFile(
    '/Users/sebastienlorber/Desktop/projects/docusaurus/website/src/pages/index.js',
    'utf8',
  );

  console.log('code', code);

  const transformOptions = getBabelOptions({
    isServer: true,
    babelOptions: getCustomBabelConfigFilePath(siteDir),
  });

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const parsedCode = require('@babel/core').parse(code, {
    ...transformOptions,
    filename: 'index.jsx',
  });

  console.log('parsedCode', parsedCode);

  return {};
}
