/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import chalk from 'chalk';
import path from 'path';
import importFresh from 'import-fresh';

export async function swizzle(
  siteDir: string,
  themeName: string,
  componentName?: string,
): Promise<void> {
  const Plugin = importFresh(themeName);
  const context = {siteDir};
  const PluginInstance = new Plugin(context);
  let fromPath = PluginInstance.getThemePath();

  if (fromPath) {
    let toPath = path.resolve(siteDir, 'theme');
    if (componentName) {
      fromPath = path.join(fromPath, componentName);
      toPath = path.join(toPath, componentName);
    }
    await fs.copy(fromPath, toPath);

    const relativeDir = path.relative(process.cwd(), toPath);
    const fromMsg = chalk.blue(
      componentName ? `${themeName}/${componentName}` : themeName,
    );
    const toMsg = chalk.cyan(relativeDir);
    console.log(
      `\n${chalk.green('Success!')} Copied ${fromMsg} to ${toMsg}.\n`,
    );
  }
}
