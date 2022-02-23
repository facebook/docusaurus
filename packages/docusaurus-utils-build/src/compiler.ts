/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs';
import path from 'path';
import Prettier from 'prettier';
import {transformFileSync} from '@babel/core';

export function getTargetPath(
  filePath: string,
  sourceDir: string,
  targetDir: string,
): string {
  return path.resolve(targetDir, path.relative(sourceDir, filePath));
}

export function compileOrCopy(
  filePath: string,
  sourceDir: string,
  targetDir: string,
  compileAction: (file: string) => string,
): void {
  const targetPath = getTargetPath(filePath, sourceDir, targetDir).replace(
    /\.tsx?/g,
    '.js',
  );
  fs.mkdirSync(path.dirname(targetPath), {recursive: true});
  if (/\.tsx?/.test(path.extname(filePath))) {
    fs.writeFileSync(targetPath, compileAction(filePath));
  } else {
    fs.copyFileSync(filePath, targetPath);
  }
}

export function compileServerCode(file: string): string {
  return (
    transformFileSync(file, {
      presets: [
        ['@babel/preset-typescript', {isTSX: true, allExtensions: true}],
      ],
      plugins: [
        '@babel/plugin-transform-modules-commonjs',
        '@babel/plugin-proposal-nullish-coalescing-operator',
        '@babel/plugin-proposal-optional-chaining',
      ],
    })?.code ?? ''
  );
}

export function compileClientCode(
  file: string,
  prettierConfig?: Prettier.Options,
): string {
  const code =
    transformFileSync(file, {
      presets: [
        ['@babel/preset-typescript', {isTSX: true, allExtensions: true}],
      ],
    })?.code ?? '';
  if (!prettierConfig) {
    return code;
  }
  return Prettier.format(code, {parser: 'babel', ...prettierConfig});
}
