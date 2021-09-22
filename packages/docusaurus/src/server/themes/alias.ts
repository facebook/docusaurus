/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import path from 'path';
import {fileToPath, posixPath, normalizeUrl, Globby} from '@docusaurus/utils';
import {ThemeAliases} from '@docusaurus/types';
import {sortBy} from 'lodash';

// Order of Webpack aliases is important because one alias can shadow another
// This ensure @theme/NavbarItem alias is after @theme/NavbarItem/LocaleDropdown
// See https://github.com/facebook/docusaurus/pull/3922
// See https://github.com/facebook/docusaurus/issues/5382
export function sortAliases(aliases: ThemeAliases): ThemeAliases {
  // Alphabetical order by default
  const entries = sortBy(Object.entries(aliases), ([alias]) => alias);
  // @theme/NavbarItem should be after @theme/NavbarItem/LocaleDropdown
  entries.sort(([alias1], [alias2]) => {
    return alias1.includes(`${alias2}/`) ? -1 : 0;
  });
  return Object.fromEntries(entries);
}

// TODO make async
export default function themeAlias(
  themePath: string,
  addOriginalAlias: boolean,
): ThemeAliases {
  if (!fs.pathExistsSync(themePath)) {
    return {};
  }

  const themeComponentFiles = Globby.sync(['**/*.{js,jsx,ts,tsx}'], {
    cwd: themePath,
  });

  const aliases: ThemeAliases = {};

  themeComponentFiles.forEach((relativeSource) => {
    const filePath = path.join(themePath, relativeSource);
    const fileName = fileToPath(relativeSource);

    const aliasName = posixPath(
      normalizeUrl(['@theme', fileName]).replace(/\/$/, ''),
    );
    aliases[aliasName] = filePath;

    if (addOriginalAlias) {
      // For swizzled components to access the original.
      const originalAliasName = posixPath(
        normalizeUrl(['@theme-original', fileName]).replace(/\/$/, ''),
      );
      aliases[originalAliasName] = filePath;
    }
  });

  return sortAliases(aliases);
}
