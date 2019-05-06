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

module.exports = async function eject(siteDir, pluginName) {
  let Plugin;
  try {
    Plugin = importFresh(pluginName);
  } catch (ex) {
    throw new Error(`Error loading '${pluginName}' plugin.`);
  }

  const context = {siteDir};
  const PluginInstance = new Plugin(context);
  const fromPath = PluginInstance.getThemePath();

  if (fromPath) {
    const toPath = path.resolve(siteDir, 'theme');
    await fs.copy(fromPath, toPath);

    const relativeDir = path.relative(process.cwd(), toPath);
    console.log(
      `\n${chalk.green('Success!')} Copied ${chalk.blue(
        pluginName,
      )} theme files to ${chalk.cyan(relativeDir)}.\n`,
    );
  }
};
