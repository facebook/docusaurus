/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {ThemeAlias} from '@docusaurus/types';
import themeAlias from './alias';

function buildThemeAliases(
  themeAliases: ThemeAlias,
  aliases: ThemeAlias = {},
): ThemeAlias {
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

export default function loadThemeAlias(
  themePaths: string[],
  userThemePaths: string[] = [],
): ThemeAlias {
  let aliases = {};

  themePaths.forEach((themePath) => {
    const themeAliases = themeAlias(themePath);
    aliases = {...aliases, ...buildThemeAliases(themeAliases, aliases)};
  });

  userThemePaths.forEach((themePath) => {
    const userThemeAliases = themeAlias(themePath, false);
    aliases = {...aliases, ...buildThemeAliases(userThemeAliases, aliases)};
  });

  return aliases;
}
