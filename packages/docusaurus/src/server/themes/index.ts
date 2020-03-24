/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {ThemeAlias} from '@docusaurus/types';
import {themeAlias} from './alias';

export function loadThemeAlias(
  themePaths: string[],
  userThemePaths: string[] = [],
): ThemeAlias {
  const aliases = {};

  themePaths.forEach(themePath => {
    const themeAliases = themeAlias(themePath);
    Object.keys(themeAliases).forEach(aliasKey => {
      if (aliasKey in aliases) {
        const componentName = aliasKey.substring(aliasKey.indexOf('/') + 1);
        aliases[`@theme-init/${componentName}`] = aliases[aliasKey];
      }

      aliases[aliasKey] = themeAliases[aliasKey];
    });
  });

  userThemePaths.forEach(themePath => {
    const userThemeAliases = themeAlias(themePath, false);
    Object.keys(userThemeAliases).forEach(aliasKey => {
      aliases[aliasKey] = userThemeAliases[aliasKey];
    });
  });

  return aliases;
}
