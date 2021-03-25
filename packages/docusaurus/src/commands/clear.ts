/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import fs from 'fs-extra';
import path from 'path';
import chalk = require('chalk');
import {DEFAULT_BUILD_DIR_NAME, GENERATED_FILES_DIR_NAME} from '../constants';

function removePath(fsPath: string) {
  return fs
    .remove(path.join(fsPath))
    .then(() => {
      console.log(`${chalk.green(`Removing ${fsPath}`)}`);
    })
    .catch((err) => {
      console.error(`Could not remove ${fsPath}`);
      console.error(err);
    });
}

export default async function clear(siteDir: string): Promise<unknown> {
  return Promise.all([
    removePath(path.join(siteDir, GENERATED_FILES_DIR_NAME)),
    removePath(path.join(siteDir, DEFAULT_BUILD_DIR_NAME)),
    removePath(path.join(siteDir, 'node_modules', '.cache')),
  ]);
}
