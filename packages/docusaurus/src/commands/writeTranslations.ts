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
  const context = loadContext(siteDir);
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

  const translationsFilePath = await writeTranslationsFile({
    siteDir,
    locale: context.localization.defaultLocale,
    translations,
  });
  console.log(
    chalk.cyan(`Translations file written at path=${translationsFilePath}`),
  );
}
