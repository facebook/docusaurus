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

  // See https://github.com/facebook/docusaurus/pull/3922
  // ensure @theme/NavbarItem alias is created after @theme/NavbarItem/LocaleDropdown
  const sortedThemeComponentFiles = sortBy(themeComponentFiles, (file) =>
    file.endsWith('/index.js'),
  );

  const aliases: ThemeAliases = {};

  sortedThemeComponentFiles.forEach((relativeSource) => {
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

  return aliases;
}
