/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {themeAlias, Alias} from './alias';

export {Alias} from './alias';

export function loadThemeAlias(themePaths: string[]): Alias {
  return themePaths.reduce(
    (alias, themePath) => ({
      ...alias,
      ...themeAlias(themePath),
    }),
    {},
  );
}
