/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import path from 'path';
import logger from '@docusaurus/logger';
import {
  DEFAULT_BUILD_DIR_NAME,
  GENERATED_FILES_DIR_NAME,
} from '@docusaurus/utils';

async function removePath(fsPath: string) {
  try {
    fs.remove(path.join(fsPath));
    logger.success`Removed the path=${fsPath} directory.`;
  } catch (e) {
    logger.error`Could not remove path=${fsPath} directory.
${e as string}`;
  }
}

export default async function clear(siteDir: string): Promise<unknown> {
  return Promise.all([
    removePath(path.join(siteDir, GENERATED_FILES_DIR_NAME)),
    removePath(path.join(siteDir, DEFAULT_BUILD_DIR_NAME)),
    removePath(path.join(siteDir, 'node_modules', '.cache')),
  ]);
}
