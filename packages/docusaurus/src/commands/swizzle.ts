/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import importFresh from 'import-fresh';
import path from 'path';

import {THEME_PATH} from '../constants';
import {loadContext} from '../server';

import chalk = require('chalk');

export async function swizzle(
  siteDir: string,
  themeName: string,
  componentName?: string,
): Promise<void> {
  const plugin: any = importFresh(themeName);
  const context = loadContext(siteDir);
  const pluginInstance = plugin(context);
  let fromPath = pluginInstance.getThemePath();

  if (fromPath) {
    let toPath = path.resolve(siteDir, THEME_PATH);
    if (componentName) {
      fromPath = path.join(fromPath, componentName);
      toPath = path.join(toPath, componentName);

      // Handle single js file only.
      // E.g: if <fromPath> does not exist, we try to swizzle <fromPath>.js instead
      if (!fs.existsSync(fromPath) && fs.existsSync(`${fromPath}.js`)) {
        [fromPath, toPath] = [`${fromPath}.js`, `${toPath}.js`];
      }
    }
    await fs.copy(fromPath, toPath);

    const relativeDir = path.relative(process.cwd(), toPath);
    const fromMsg = chalk.blue(
      componentName ? `${themeName} ${chalk.yellow(componentName)}` : themeName,
    );
    const toMsg = chalk.cyan(relativeDir);
    console.log(
      `\n${chalk.green('Success!')} Copied ${fromMsg} to ${toMsg}.\n`,
    );
  }
}
