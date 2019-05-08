/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const fs = require('fs-extra');
const chalk = require('chalk');
const path = require('path');
const importFresh = require('import-fresh');

module.exports = async function swizzle(siteDir, themeName, componentName) {
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
};
