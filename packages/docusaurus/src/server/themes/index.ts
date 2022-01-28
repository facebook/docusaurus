/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {ThemeAliases, LoadedPlugin} from '@docusaurus/types';
import path from 'path';
import {THEME_PATH} from '@docusaurus/utils';
import themeAlias, {sortAliases} from './alias';

const ThemeFallbackDir = path.resolve(__dirname, '../../client/theme-fallback');

export function loadThemeAliases(
  themePaths: string[],
  userThemePaths: string[],
): ThemeAliases {
  const aliases: ThemeAliases = {};

  themePaths.forEach((themePath) => {
    const themeAliases = themeAlias(themePath, true);
    Object.keys(themeAliases).forEach((aliasKey) => {
      // If this alias shadows a previous one, use @theme-init to preserve the initial one.
      // @theme-init is only applied once: to the initial theme that provided this component
      if (aliasKey in aliases) {
        const componentName = aliasKey.substring(aliasKey.indexOf('/') + 1);
        const initAlias = `@theme-init/${componentName}`;
        if (!(initAlias in aliases)) {
          aliases[initAlias] = aliases[aliasKey];
        }
      }
      aliases[aliasKey] = themeAliases[aliasKey];
    });
  });

  userThemePaths.forEach((themePath) => {
    const userThemeAliases = themeAlias(themePath, false);
    Object.assign(aliases, userThemeAliases);
  });

  return sortAliases(aliases);
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
