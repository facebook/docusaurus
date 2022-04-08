/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import logger from '@docusaurus/logger';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import childProcess from 'child_process';
import {clear} from './clear';

async function hasYarn() {
  return fs.pathExists(path.resolve(path.dirname(process.cwd()), 'yarn.lock'));
}

type CommonNpmTags = 'alpha' | 'beta' | 'latest' | 'next';

export async function upgrade(
  siteDir: string,
  {tag}: {tag: CommonNpmTags},
): Promise<void> {
  const [npmClient, npmCommand] = (await hasYarn())
    ? ['yarn', 'upgrade']
    : ['npm', 'install'];

  const {dependencies = {}, devDependencies = {}} = await fs.readJSON(
    path.join(siteDir, 'package.json'),
  );

  const packageNames = Array.from(
    new Set(
      [...Object.keys(dependencies), ...Object.keys(devDependencies)].filter(
        (pkg) => pkg.startsWith('@docusaurus'),
      ),
    ),
  )
    .sort()
    .map((name) => (tag ? `${name}@${tag}` : name));

  if (!packageNames.length) {
    logger.error(`Found 0 packages with scope @docusaurus`);
    return;
  }

  logger.info`Found number=${packageNames.length} to update: name=${packageNames}`;
  logger.info`Executing code=${`${npmClient} ${npmCommand} ${packageNames.join(
    ' ',
  )}`}`;

  childProcess.spawnSync(npmClient, [npmCommand, ...packageNames], {
    stdio: 'inherit',
    shell: os.platform() === 'win32',
  });

  await clear(siteDir);
}
