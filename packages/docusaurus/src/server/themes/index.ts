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

const ThemeFallbackDir = path.join(__dirname, '../../client/theme-fallback');

export async function loadThemeAliases(
  themePaths: string[],
  userThemePaths: string[],
): Promise<ThemeAliases> {
  const aliases: ThemeAliases = {};

  for (const themePath of themePaths) {
    const themeAliases = await themeAlias(themePath, true);
    Object.entries(themeAliases).forEach(([aliasKey, alias]) => {
      // If this alias shadows a previous one, use @theme-init to preserve the
      // initial one. @theme-init is only applied once: to the initial theme
      // that provided this component
      if (aliasKey in aliases) {
        const componentName = aliasKey.substring(aliasKey.indexOf('/') + 1);
        const initAlias = `@theme-init/${componentName}`;
        if (!(initAlias in aliases)) {
          aliases[initAlias] = aliases[aliasKey]!;
        }
      }
      aliases[aliasKey] = alias;
    });
  }

  for (const themePath of userThemePaths) {
    const userThemeAliases = await themeAlias(themePath, false);
    Object.assign(aliases, userThemeAliases);
  }

  return sortAliases(aliases);
}

export function loadPluginsThemeAliases({
  siteDir,
  plugins,
}: {
  siteDir: string;
  plugins: LoadedPlugin[];
}): Promise<ThemeAliases> {
  const pluginThemes: string[] = plugins
    .map((plugin) => plugin.getThemePath?.())
    .filter((x): x is string => Boolean(x));
  const userTheme = path.resolve(siteDir, THEME_PATH);
  return loadThemeAliases([ThemeFallbackDir, ...pluginThemes], [userTheme]);
}
