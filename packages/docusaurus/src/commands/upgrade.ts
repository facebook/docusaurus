/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import chalk = require('chalk');
import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import childProcess from 'child_process';
import clear from './clear';

function hasYarn() {
  return fs.existsSync(path.resolve(path.dirname(process.cwd()), 'yarn.lock'));
}

type CommonNpmTags = 'alpha' | 'beta' | 'latest' | 'next';
export default function upgrade(opts: {tag: CommonNpmTags}): void {
  const [npmClient, npmCommand] = hasYarn()
    ? ['yarn', 'upgrade']
    : ['npm', 'install'];

  const {dependencies = {}, devDependencies = {}} = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), './package.json'), 'utf8'),
  );

  let packageNames = Array.from(
    new Set(
      [...Object.keys(dependencies), ...Object.keys(devDependencies)].filter(
        (pkg) => pkg.startsWith('@docusaurus'),
      ),
    ),
  ).sort();

  if (!packageNames.length) {
    console.log(chalk.red(`Found 0 packages with scope @docusaurus`));
    return;
  }

  if (opts.tag) {
    packageNames = packageNames.map((_) => `${_}@${opts.tag}`);
  }

  console.log(chalk.green(`Found ${packageNames.length} to update:`));
  console.log(packageNames);
  console.log(
    chalk.cyan(
      `Executing "${npmClient} ${npmCommand} ${packageNames.join(' ')}"`,
    ),
  );

  childProcess.spawnSync(npmClient, [npmCommand, ...packageNames], {
    stdio: 'inherit',
    shell: os.platform() === 'win32',
  });

  clear(path.resolve('.'));
}
