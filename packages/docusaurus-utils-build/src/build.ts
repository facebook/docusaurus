/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs';
import {Globby} from '@docusaurus/utils';
import Prettier from 'prettier';
import {compileOrCopy, fullyTranspile, stripTypes} from './compiler';

function transformDir(
  sourceDir: string,
  targetDir: string,
  compileAction: (file: string) => string,
  ignore: string[],
) {
  Globby(`${sourceDir}/**/*`, {ignore}).then((files) =>
    files.forEach((filePath) =>
      compileOrCopy(filePath, sourceDir, targetDir, compileAction),
    ),
  );
}

export default async function build(
  options: Partial<{
    sourceDir: string;
    targetDir: string;
    themeDir: string;
    themeTargetDir: string;
    ignore: string[];
  }> = {},
): Promise<void> {
  const {
    sourceDir = 'src',
    targetDir = 'lib',
    themeDir = 'src/theme',
    themeTargetDir = 'lib/theme',
    ignore = ['**/__tests__/**'],
  } = options;
  // Compile: src/*.ts -> lib/*.js
  transformDir(sourceDir, targetDir, fullyTranspile, [...ignore, '**/*.d.ts']);
  // Strip types & prettier: src/theme/*.tsx -> lib/theme/*.js (client code will be swizzlable)
  if (fs.existsSync(themeDir)) {
    const prettierConfig = await Prettier.resolveConfig(themeDir);
    if (!prettierConfig) {
      throw new Error('Prettier config file not found');
    }
    transformDir(
      themeDir,
      themeTargetDir,
      (file) => stripTypes(file, prettierConfig),
      [...ignore, '**/*.d.ts'],
    );
  }
}
