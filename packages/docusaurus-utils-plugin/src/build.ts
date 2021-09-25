/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {transformFileSync} from '@babel/core';
import {Globby} from '@docusaurus/utils';
import prettier from 'prettier';
import path from 'path';
import fs from 'fs';

function compileOrCopy(
  filePath: string,
  sourceDir: string,
  targetDir: string,
  compileAction: (file: string) => string,
) {
  const targetPath = path
    .resolve(targetDir, path.relative(sourceDir, filePath))
    .replace(/\.tsx?/g, '.js');
  fs.mkdirSync(path.dirname(targetPath), {recursive: true});
  if (/\.tsx?/.test(path.extname(filePath))) {
    fs.writeFileSync(targetPath, compileAction(filePath));
  } else {
    fs.copyFileSync(filePath, targetPath);
  }
}

function transformDir(
  sourceDir: string,
  targetDir: string,
  compileAction: (file: string) => string,
  ignore: string[],
) {
  Globby(`${sourceDir}/**/*`, {
    ignore: [...ignore, '**/*.d.ts'],
  }).then((files) =>
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
    themeTargetDir = 'lib/js-theme',
    ignore = ['**/__tests__/**'],
  } = options;
  // Compile: src/*.ts -> lib/*.js
  transformDir(
    sourceDir,
    targetDir,
    (file) =>
      transformFileSync(file, {
        presets: [
          ['@babel/preset-typescript', {isTSX: true, allExtensions: true}],
        ],
        plugins: [
          '@babel/plugin-transform-modules-commonjs',
          '@babel/plugin-proposal-nullish-coalescing-operator',
          '@babel/plugin-proposal-optional-chaining',
        ],
      })?.code ?? '',
    [...ignore, '**/*.d.ts'],
  );
  // Re-compile & prettier: src/theme/*.tsx -> lib/js-theme/*.js (for swizzling)
  if (fs.existsSync(themeDir)) {
    const prettierConfig = await prettier.resolveConfig(themeDir);
    if (!prettierConfig) {
      throw new Error('Prettier config file not found');
    }
    transformDir(
      themeDir,
      themeTargetDir,
      (file) =>
        // TODO let's hope for the pipeline operator :D
        prettier.format(
          transformFileSync(file, {
            presets: [
              ['@babel/preset-typescript', {isTSX: true, allExtensions: true}],
            ],
          })?.code ?? '',
          {parser: 'babel', ...prettierConfig},
        ),
      [...ignore, '**/*.d.ts'],
    );
  }
}
