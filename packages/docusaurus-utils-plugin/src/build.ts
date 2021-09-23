/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// This relies on an internal implementation detail, but probably good for now
import handleDir from '@babel/cli/lib/babel/dir';
import path from 'path';

export default async function build(
  options: Partial<{
    sourceDir: string;
    targetDir: string;
    theme: boolean;
    themeDir: string;
    themeTargetDir: string;
  }> = {},
): Promise<void> {
  const {
    sourceDir = 'src',
    targetDir = 'lib',
    themeDir,
    themeTargetDir = 'js-theme',
  } = options;
  handleDir({
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
  if (themeDir) {
    handleDir({
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
