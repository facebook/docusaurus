/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs';
import chokidar from 'chokidar';
import _ from 'lodash';
import logger from '@docusaurus/logger';
import {
  compileOrCopy,
  compileServerCode,
  compileClientCode,
  // eslint-disable-next-line import/no-unresolved
} from './compiler.js';

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
  const compile = _.debounce((filePath: string) => {
    try {
      // TODO: is check this good enough?
      if (filePath.includes(themeDir)) {
        // For perf reasons, we don't do prettier in watch mode
        compileOrCopy(filePath, themeDir, themeTargetDir, compileClientCode);
      } else {
        compileOrCopy(filePath, sourceDir, targetDir, compileServerCode);
      }
    } catch (e) {
      logger.error`Error while processing path=${filePath}:`;
      logger.error(e);
    }
  }, 200);

  ['add', 'change'].forEach((event) =>
    watcher.on(event, async (filePath: string) => {
      compile(filePath);
      logger.success`Compilation of path=${filePath} finished`;
    }),
  );
  logger.info`Watching file changes in path=${sourceDir}${
    fs.existsSync(themeDir)
      ? logger.interpolate` (server) and path=${themeDir} (client)`
      : ''
  }...`;
}
