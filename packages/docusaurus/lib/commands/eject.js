/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const fs = require('fs-extra');
const chalk = require('chalk');
const path = require('path');

module.exports = async function eject(siteDir) {
  const defaultTheme = path.resolve(__dirname, '..', 'default-theme');
  const customTheme = path.resolve(siteDir, 'theme');
  await fs.copy(defaultTheme, customTheme);

  const relativeDir = path.relative(process.cwd(), customTheme);
  console.log(
    `\n${chalk.green('Success!')} Copied default theme files to ${chalk.cyan(
      relativeDir,
    )}.\n`,
  );
};
