/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs';
import {Globby} from '@docusaurus/utils';
import logger from '@docusaurus/logger';
import Prettier from 'prettier';
import shelljs from 'shelljs';
import {compileOrCopy, compileServerCode, compileClientCode} from './compiler';
// import {tsc} from './tsc';

function transformDir(
  sourceDir: string,
  targetDir: string,
  compileAction: (content: string) => string,
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
  logger.info('Compiling source with Babel...');
  transformDir(sourceDir, targetDir, compileServerCode, [
    ...ignore,
    '**/*.d.ts',
  ]);
  // Generate declaration: src/*.ts -> lib/*.d.ts
  // await tsc(sourceDir, targetDir, ignore);
  logger.info('Typechecking and generating declaration with TSC...');
  const res = shelljs.exec('tsc --emitDeclarationOnly'); // 😅
  if (res.code !== 0) {
    throw new Error('Typechecking failed.');
  }
  // Strip types & format: src/theme/*.tsx -> lib/theme/*.js
  // (client code will be swizzlable)
  if (fs.existsSync(themeDir)) {
    const prettierConfig = await Prettier.resolveConfig(themeDir);
    if (!prettierConfig) {
      throw new Error(
        'Prettier config file not found. Building the theme code requires using Prettier to format the JS code, which will be used for swizzling.',
      );
    }
    logger.info('Compiling theme with Babel + Prettier...');
    transformDir(
      themeDir,
      themeTargetDir,
      (file) => compileClientCode(file, prettierConfig),
      [...ignore, '**/*.d.ts'],
    );
  }
}
