/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import {loadContext, loadPluginConfigs} from '../server';
import initPlugins from '../server/plugins/init';

import chalk from 'chalk';
import {
  collectPluginTranslation,
  writeTranslationsFile,
} from '../server/translations';
import {DocusaurusI18nTranslations} from '@docusaurus/types';

export default async function writeTranslations(
  siteDir: string,
): Promise<void> {
  const context = loadContext(siteDir);
  const pluginConfigs = loadPluginConfigs(context);
  const plugins = initPlugins({
    pluginConfigs,
    context,
  });

  const translations: DocusaurusI18nTranslations = {
    plugins: collectPluginTranslation(plugins),
    pages: {
      todo: 'todo',
    },
  };

  const translationsFilePath = await writeTranslationsFile({
    siteDir,
    locale: context.localization.defaultLocale,
    translations,
  });
  console.log(
    chalk.cyan(`Translations file written at path=${translationsFilePath}`),
  );
}
