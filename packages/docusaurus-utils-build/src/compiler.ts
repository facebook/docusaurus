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

export function compileOrCopy(
  filePath: string,
  sourceDir: string,
  targetDir: string,
  compileAction: (file: string) => string,
): void {
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

export function fullyTranspile(file: string): string {
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

export function stripTypes(
  file: string,
  prettierConfig: Prettier.Options,
): string {
  // TODO let's hope for the pipeline operator :D
  return Prettier.format(
    transformFileSync(file, {
      presets: [
        ['@babel/preset-typescript', {isTSX: true, allExtensions: true}],
      ],
    })?.code ?? '',
    {parser: 'babel', ...prettierConfig},
  );
}
