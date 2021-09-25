/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import chokidar from 'chokidar';
import {debounce} from 'lodash';
import chalk from 'chalk';
import {fullyTranspile, compileOrCopy} from './build';

export default async function watch(
  options: Partial<{
    sourceDir: string;
    targetDir: string;
    ignore: string[];
  }> = {},
): Promise<void> {
  const {
    sourceDir = 'src',
    targetDir = 'lib',
    ignore = ['**/__tests__/**'],
  } = options;
  const watcher = chokidar.watch(sourceDir, {
    ignoreInitial: true,
    ignored: ignore,
    awaitWriteFinish: {
      stabilityThreshold: 50,
      pollInterval: 10,
    },
  });
  const debouncedCompile = debounce((filePath) => {
    try {
      compileOrCopy(filePath, sourceDir, targetDir, fullyTranspile);
    } catch (e) {
      console.log(chalk.red(`Error while processing ${chalk.cyan(filePath)}:`));
      console.error(e);
    }
  }, 200);

  ['add', 'change'].forEach((event) =>
    watcher.on(event, async (filePath: string) => {
      debouncedCompile(filePath);
      console.log(
        chalk.green(`Compilation of ${chalk.cyan(filePath)} finished`),
      );
    }),
  );
  console.log(
    chalk.green(`Watching file changes in ${chalk.cyan(sourceDir)}...`),
  );
}
