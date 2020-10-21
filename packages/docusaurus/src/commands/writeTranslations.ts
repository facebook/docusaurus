/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import fs from 'fs-extra';
import path from 'path';
import {loadContext, loadPluginConfigs} from '../server';
import initPlugins from '../server/plugins/init';
import {loadLocalizationContext} from '../server/localization';
import chalk from 'chalk';

export default async function writeTranslations(
  siteDir: string,
): Promise<void> {
  const context = loadContext(siteDir);
  const pluginConfigs = loadPluginConfigs(context);
  const plugins = initPlugins({
    pluginConfigs,
    context,
  });
  const localizationContext = loadLocalizationContext(siteDir);

  const translations = {};

  plugins.forEach((plugin) => {
    if (plugin.getTranslations) {
      translations[plugin.name] = translations[plugin.name] ?? {};
      translations[plugin.name][plugin.options.id] = plugin.getTranslations();
    }
  });

  const fileDir = path.resolve(
    path.join(siteDir, `i18n`, localizationContext.defaultLocale),
  );
  await fs.ensureDir(fileDir);

  const filePath = path.join(fileDir, `translations.json`);

  await fs.writeFile(filePath, JSON.stringify(translations, null, 2));
  console.log(chalk.cyan(`Translations file written at path=${filePath}`));
}
