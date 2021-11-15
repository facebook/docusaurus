/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const chalk = require('chalk');
const fs = require('fs-extra');
const semver = require('semver');
const path = require('path');
const updateNotifier = require('update-notifier');
const boxen = require('boxen');

const {
  name,
  version,
  engines: {node: requiredVersion},
} = require('../package.json');

// Notify user if @docusaurus packages is outdated
//
// Note: this is a 2-step process to avoid delaying cli usage by awaiting a response:
// - 1st run: trigger background job to check releases + store result
// - 2nd run: display potential update to users
//
// Note: even if the
//
// cache data is stored in ~/.config/configstore/update-notifier-@docusaurus
//
const notifier = updateNotifier({
  pkg: {
    name,
    version,
  },
  // Check is in background so it's fine to use a small value like 1h
  // Use 0 for debugging
  updateCheckInterval: 1000 * 60 * 60,
  // updateCheckInterval: 0
});

// Hacky way to ensure we check for updates on first run
// Note: the notification will only happen in the 2nd run
// See https://github.com/yeoman/update-notifier/issues/209
try {
  if (
    notifier.config &&
    !notifier.disabled &&
    Date.now() - notifier.config.get('lastUpdateCheck') < 50
  ) {
    notifier.config.set('lastUpdateCheck', 0);
    notifier.check();
  }
} catch (e) {
  // Do not stop cli if this fails, see https://github.com/facebook/docusaurus/issues/5400
  console.error(e);
}

// We don't want to display update message for canary releases
// See https://github.com/facebook/docusaurus/issues/5378
function ignoreUpdate(update) {
  const isCanaryRelease =
    update && update.current && update.current.startsWith('0.0.0');
  return isCanaryRelease;
}

if (
  notifier.config &&
  notifier.update &&
  semver.lt(notifier.update.current, notifier.update.latest)
) {
  // Because notifier clears cached data after reading it, leading to notifier not consistently displaying the update
  // See https://github.com/yeoman/update-notifier/issues/209
  notifier.config.set('update', notifier.update);

  if (ignoreUpdate(notifier.update)) {
    return;
  }

  // eslint-disable-next-line import/no-dynamic-require, global-require
  const sitePkg = require(path.resolve(process.cwd(), 'package.json'));
  const siteDocusaurusPackagesForUpdate = Object.keys({
    ...sitePkg.dependencies,
    ...sitePkg.devDependencies,
  })
    .filter((p) => p.startsWith('@docusaurus'))
    .map((p) => p.concat('@latest'))
    .join(' ');
  const isYarnUsed = fs.existsSync(path.resolve(process.cwd(), 'yarn.lock'));
  const upgradeCommand = isYarnUsed
    ? `yarn upgrade ${siteDocusaurusPackagesForUpdate}`
    : `npm i ${siteDocusaurusPackagesForUpdate}`;

  const boxenOptions = {
    padding: 1,
    margin: 1,
    align: 'center',
    borderColor: 'yellow',
    borderStyle: 'round',
  };

  const docusaurusUpdateMessage = boxen(
    `Update available ${chalk.dim(`${notifier.update.current}`)}${chalk.reset(
      ' → ',
    )}${chalk.green(
      `${notifier.update.latest}`,
    )}\n\nTo upgrade Docusaurus packages with the latest version, run the following command:\n${chalk.cyan(
      `${upgradeCommand}`,
    )}`,
    boxenOptions,
  );

  console.log(docusaurusUpdateMessage);
}

// notify user if node version needs to be updated
if (!semver.satisfies(process.version, requiredVersion)) {
  console.log(
    chalk.red(`\nMinimum Node version not met :(`) +
      chalk.yellow(
        `\n\nYou are using Node ${process.version}. We require Node ${requiredVersion} or up!\n`,
      ),
  );
  process.exit(1);
}
