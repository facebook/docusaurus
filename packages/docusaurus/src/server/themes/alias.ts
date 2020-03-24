/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import globby from 'globby';
import fs from 'fs-extra';
import path from 'path';
import {fileToPath, posixPath, normalizeUrl} from '@docusaurus/utils';
import {ThemeAlias} from '@docusaurus/types';

export function themeAlias(
  themePath: string,
  addOriginalAlias: boolean = true,
): ThemeAlias {
  if (!fs.pathExistsSync(themePath)) {
    return {};
  }

  const themeComponentFiles = globby.sync(['**/*.{js,jsx}'], {
    cwd: themePath,
  });

  const aliases: ThemeAlias = {};

  themeComponentFiles.forEach(relativeSource => {
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
