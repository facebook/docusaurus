/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import {loadContext, loadPluginConfigs} from '../server';
import initPlugins, {InitPlugin} from '../server/plugins/init';

import chalk from 'chalk';
import {
  collectPluginTranslations,
  writeTranslationsFile,
  collectPluginTranslationSourceCodeFilePaths,
} from '../server/translations';
import {DocusaurusI18nTranslations} from '@docusaurus/types';
import {getBabelOptions, getCustomBabelConfigFilePath} from '../webpack/utils';
import {
  extractAllSourceCodeFileTranslations,
  SourceCodeFileTranslations,
} from '../server/translationsExtractor';
import {TransformOptions} from '@babel/core';
import {isArray, isObject, mapValues} from 'lodash';

// Should we warn here if the same translation "key" is found in multiple source code files?
function flattenSourceCodeFileTranslations(
  sourceCodeFileTranslations: SourceCodeFileTranslations[],
): Record<string, string> {
  return sourceCodeFileTranslations.reduce((acc, item) => {
    return {...acc, ...item.translations};
  }, {});
}

async function extractPluginCodeTranslations(
  plugins: InitPlugin[],
  babelOptions: TransformOptions,
): Promise<Record<string, string>> {
  const sourceCodePaths = await collectPluginTranslationSourceCodeFilePaths(
    plugins,
  );
  const codeTranslations = await extractAllSourceCodeFileTranslations(
    sourceCodePaths,
    babelOptions,
  );
  return flattenSourceCodeFileTranslations(codeTranslations);
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
  const babelOptions = getBabelOptions({
    isServer: true,
    babelOptions: getCustomBabelConfigFilePath(siteDir),
  });

  async function getTranslations(): Promise<DocusaurusI18nTranslations> {
    const [pluginTranslations, extractedTranslations] = await Promise.all([
      collectPluginTranslations(plugins),
      extractPluginCodeTranslations(plugins, babelOptions),
    ]);
    return {
      plugins: pluginTranslations,
      code: extractedTranslations,
    };
  }

  const translations = await getTranslations();

  await Promise.all(
    context.i18n.context.locales.map((locale) =>
      writeLocaleTranslations({locale, translations, siteDir}),
    ),
  );
}

// TODO we should probably merge if the file already exists?
// or provide a cli option?
async function writeLocaleTranslations({
  siteDir,
  locale,
  translations,
}: {
  siteDir: string;
  locale: string;
  translations: DocusaurusI18nTranslations;
}) {
  // TODO do we want to keep this suffix feature?
  const suffixedTranslations = addTranslationSuffix(
    translations,
    ` (${locale})`,
  );

  const translationsFilePath = await writeTranslationsFile({
    siteDir,
    locale,
    translations: suffixedTranslations,
  });
  console.log(
    chalk.cyan(`Translations file written at path=${translationsFilePath}`),
  );
}

// inspired by https://github.com/lodash/lodash/issues/1244#issuecomment-378314930
// TODO type? do we actually want to keep this?
function mapValuesDeep<T>(obj: T, cb: Function): T {
  if (isArray(obj)) {
    return obj.map((innerObj) => mapValuesDeep(innerObj, cb)) as any;
  } else if (isObject(obj)) {
    return mapValues(obj, (val) => mapValuesDeep(val, cb)) as any;
  } else {
    return cb(obj);
  }
}
function addTranslationSuffix(
  translations: DocusaurusI18nTranslations,
  suffix: string,
): DocusaurusI18nTranslations {
  return mapValuesDeep(translations, (value) => {
    if (typeof value === 'string') {
      return value + suffix;
    }
    return value;
  });
}
