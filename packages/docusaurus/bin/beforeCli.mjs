/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// @ts-check

import logger from '@docusaurus/logger';
import fs from 'fs-extra';
import semver from 'semver';
import path from 'path';
import updateNotifier from 'update-notifier';
import boxen from 'boxen';
import {createRequire} from 'module';

const packageJson = createRequire(import.meta.url)('../package.json');
const sitePkg = createRequire(path.join(process.cwd(), 'package.json'))(
  './package.json',
);

const {
  name,
  version,
  engines: {node: requiredVersion},
} = packageJson;

/**
 * Notify user if `@docusaurus` packages are outdated
 *
 * Note: this is a 2-step process to avoid delaying cli usage by awaiting a
 * response:
 * - 1st run: trigger background job to check releases + store result
 * - 2nd run: display potential update to users
 *
 * cache data is stored in `~/.config/configstore/update-notifier-@docusaurus`
 */
export default async function beforeCli() {
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
      // @ts-expect-error: this is an internal API
      !notifier.disabled &&
      Date.now() - notifier.config.get('lastUpdateCheck') < 50
    ) {
      notifier.config.set('lastUpdateCheck', 0);
      notifier.check();
    }
  } catch (err) {
    // Do not stop cli if this fails, see https://github.com/facebook/docusaurus/issues/5400
    logger.error(err);
  }

  /**
   * We don't want to display update message for canary releases.
   * See https://github.com/facebook/docusaurus/issues/5378
   * @param {import('update-notifier').UpdateInfo} update
   */
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
    // Because notifier clears cached data after reading it, leading to notifier
    // not consistently displaying the update.
    // See https://github.com/yeoman/update-notifier/issues/209
    notifier.config.set('update', notifier.update);

    if (ignoreUpdate(notifier.update)) {
      return;
    }

    const siteDocusaurusPackagesForUpdate = Object.keys({
      ...sitePkg.dependencies,
      ...sitePkg.devDependencies,
    })
      .filter((p) => p.startsWith('@docusaurus'))
      .map((p) => p.concat('@latest'))
      .join(' ');
    const isYarnUsed = await fs.pathExists(
      path.resolve(process.cwd(), 'yarn.lock'),
    );
    const upgradeCommand = isYarnUsed
      ? `yarn upgrade ${siteDocusaurusPackagesForUpdate}`
      : `npm i ${siteDocusaurusPackagesForUpdate}`;

    /** @type {import('boxen').Options} */
    const boxenOptions = {
      padding: 1,
      margin: 1,
      align: 'center',
      borderColor: 'yellow',
      borderStyle: 'round',
    };

    const docusaurusUpdateMessage = boxen(
      `Update available ${logger.dim(
        `${notifier.update.current}`,
      )} → ${logger.green(`${notifier.update.latest}`)}

  To upgrade Docusaurus packages with the latest version, run the following command:
  ${logger.code(upgradeCommand)}`,
      boxenOptions,
    );

    console.log(docusaurusUpdateMessage);
  }

  // notify user if node version needs to be updated
  if (!semver.satisfies(process.version, requiredVersion)) {
    logger.error('Minimum Node.js version not met :(');
    logger.info`You are using Node.js number=${process.version}, Requirement: Node.js number=${requiredVersion}.`;
    process.exit(1);
  }
}
