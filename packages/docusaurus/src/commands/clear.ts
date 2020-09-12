/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import fs from 'fs-extra';
import path from 'path';
import chalk = require('chalk');
import {BUILD_DIR_NAME, GENERATED_FILES_DIR_NAME} from '../constants';

export default async function clear(siteDir: string): Promise<void> {
  fs.remove(path.join(siteDir, GENERATED_FILES_DIR_NAME))
    .then(() => {
      console.log(`${chalk.green(`Removing ${GENERATED_FILES_DIR_NAME}`)}`);
    })
    .catch((err) => {
      console.error(err);
    });
  fs.remove(path.join(siteDir, BUILD_DIR_NAME))
    .then(() => {
      console.log(`${chalk.green(`Removing ${BUILD_DIR_NAME}`)}`);
    })
    .catch((err) => {
      console.error(err);
    });
  fs.remove(path.join(siteDir, 'node_modules/.cache/cache-loader'))
    .then(() => {
      console.log(
        `${chalk.green('Removing /node_modules/.cache/cache-loader')}`,
      );
    })
    .catch((err) => {
      console.error(err);
    });
}
