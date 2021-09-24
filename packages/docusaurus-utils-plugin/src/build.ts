/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// This relies on an internal implementation detail, but probably good for now
import transformDir from '@babel/cli/lib/babel/dir';
import path from 'path';
import fs from 'fs';

export default async function build(
  options: Partial<{
    sourceDir: string;
    targetDir: string;
    theme: boolean;
    themeDir: string;
    themeTargetDir: string;
    watch: boolean;
    prettier: boolean;
  }> = {},
): Promise<void> {
  const {
    sourceDir = 'src',
    targetDir = 'lib',
    themeDir = 'theme',
    themeTargetDir = 'js-theme',
  } = options;
  transformDir({
    cliOptions: {
      filenames: [sourceDir],
      outDir: targetDir,
      extensions: '.tsx,.ts',
      copyFiles: true,
    },
    babelOptions: {
      ignore: ['**/*.d.ts'],
      presets: [
        ['@babel/preset-typescript', {isTSX: true, allExtensions: true}],
      ],
      plugins: [
        '@babel/plugin-transform-modules-commonjs',
        '@babel/plugin-proposal-nullish-coalescing-operator',
        '@babel/plugin-proposal-optional-chaining',
      ],
    },
  });
  if (fs.existsSync(path.resolve(sourceDir, themeDir))) {
    transformDir({
      cliOptions: {
        filenames: [path.resolve(sourceDir, themeDir)],
        outDir: path.resolve(targetDir, themeTargetDir),
        extensions: '.tsx,.ts',
        copyFiles: true,
      },
      babelOptions: {
        ignore: ['**/*.d.ts'],
        presets: [
          ['@babel/preset-typescript', {isTSX: true, allExtensions: true}],
        ],
      },
    });
  }
}
