/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import chokidar from 'chokidar';
import {debounce} from 'lodash';
import chalk from 'chalk';
import {fullyTranspile, stripTypes, compileOrCopy} from './compiler';

export default async function watch(
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
  const watcher = chokidar.watch([sourceDir, themeDir], {
    ignoreInitial: true,
    ignored: [...ignore, '**/*.d.ts'],
    awaitWriteFinish: {
      stabilityThreshold: 50,
      pollInterval: 10,
    },
  });
  const debouncedCompile = debounce((filePath: string) => {
    try {
      // TODO: is check this good enough?
      if (filePath.includes(themeDir)) {
        // For perf reasons, we don't do prettier in watch mode
        compileOrCopy(filePath, themeDir, themeTargetDir, (file) =>
          stripTypes(file, {}),
        );
      } else {
        compileOrCopy(filePath, sourceDir, targetDir, fullyTranspile);
      }
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
