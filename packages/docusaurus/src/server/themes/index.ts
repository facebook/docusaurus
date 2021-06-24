/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {ThemeAliases, LoadedPlugin} from '@docusaurus/types';
import path from 'path';
import {THEME_PATH} from '../../constants';
import themeAlias from './alias';

const ThemeFallbackDir = path.resolve(__dirname, '../../client/theme-fallback');

function buildThemeAliases(
  themeAliases: ThemeAliases,
  aliases: ThemeAliases = {},
): ThemeAliases {
  Object.keys(themeAliases).forEach((aliasKey) => {
    if (aliasKey in aliases) {
      const componentName = aliasKey.substring(aliasKey.indexOf('/') + 1);
      // eslint-disable-next-line no-param-reassign
      aliases[`@theme-init/${componentName}`] = aliases[aliasKey];
    }
    // eslint-disable-next-line no-param-reassign
    aliases[aliasKey] = themeAliases[aliasKey];
  });
  return aliases;
}

export function loadThemeAliases(
  themePaths: string[],
  userThemePaths: string[] = [],
): ThemeAliases {
  let aliases = {}; // TODO refactor, inelegant side-effect

  themePaths.forEach((themePath) => {
    const themeAliases = themeAlias(themePath, true);
    aliases = {...aliases, ...buildThemeAliases(themeAliases, aliases)};
  });

  userThemePaths.forEach((themePath) => {
    const userThemeAliases = themeAlias(themePath, false);
    aliases = {...aliases, ...buildThemeAliases(userThemeAliases, aliases)};
  });

  return aliases;
}

export function loadPluginsThemeAliases({
  siteDir,
  plugins,
}: {
  siteDir: string;
  plugins: LoadedPlugin[];
}): ThemeAliases {
  const pluginThemes: string[] = plugins
    .map((plugin) => (plugin.getThemePath ? plugin.getThemePath() : undefined))
    .filter((x): x is string => Boolean(x));
  const userTheme = path.resolve(siteDir, THEME_PATH);
  return loadThemeAliases([ThemeFallbackDir, ...pluginThemes], [userTheme]);
}
