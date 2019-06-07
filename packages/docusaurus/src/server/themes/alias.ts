/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import globby from 'globby';
import fs from 'fs-extra';
import path from 'path';
import {fileToPath, posixPath, normalizeUrl} from '@docusaurus/utils';
import {ThemeAlias} from '../types';

export function themeAlias(themePath: string): ThemeAlias {
  if (!fs.pathExistsSync(themePath)) {
    return {};
  }

  const themeComponentFiles = globby.sync(['**/*.{js,jsx}'], {
    cwd: themePath,
  });

  const alias: ThemeAlias = {};
  themeComponentFiles.forEach(relativeSource => {
    const filePath = path.join(themePath, relativeSource);
    const fileName = fileToPath(relativeSource);
    const aliasName = posixPath(
      normalizeUrl(['@theme', fileName]).replace(/\/$/, ''),
    );
    alias[aliasName] = filePath;
  });

  return alias;
}
