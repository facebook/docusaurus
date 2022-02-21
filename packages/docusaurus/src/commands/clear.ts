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

async function removePath(entry: {path: string; description: string}) {
  if (!(await fs.pathExists(entry.path))) {
    return;
  }
  try {
    await fs.remove(entry.path);
    logger.success`Removed the ${entry.description} at path=${entry.path}.`;
  } catch (e) {
    logger.error`Could not remove the ${entry.description} at path=${
      entry.path
    }.
${e as string}`;
  }
}

export default async function clear(siteDir: string): Promise<unknown> {
  const generatedFolder = {
    path: path.join(siteDir, GENERATED_FILES_DIR_NAME),
    description: 'generated folder',
  };
  const buildFolder = {
    path: path.join(siteDir, DEFAULT_BUILD_DIR_NAME),
    description: 'build output folder',
  };
  // In Yarn PnP, cache is stored in `.yarn/.cache` because n_m doesn't exist
  const cacheFolders = ['node_modules', '.yarn'].map((p) => ({
    path: path.join(siteDir, p, '.cache'),
    description: 'Webpack persistent cache folder',
  }));
  return Promise.all(
    [generatedFolder, buildFolder, ...cacheFolders].map(removePath),
  );
}
