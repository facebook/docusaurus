/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import {logger} from '@docusaurus/logger';
import {type PackageManager} from './constants.js';

/**
 * We use a simple kebab-case-like conversion
 * It's not perfect, but good enough
 * We don't want to depend on lodash in this package
 * See https://github.com/facebook/docusaurus/pull/11653
 * @param siteName
 */
export function siteNameToPackageName(siteName: string): string {
  const match = siteName.match(
    /[A-Z]{2,}(?=[A-Z][a-z]+\d*|\b|_)|[A-Z]?[a-z]+\d*|[A-Z]|\d+/g,
  );
  if (match) {
    return match.map((x) => x.toLowerCase()).join('-');
  }
  return siteName;
}

export async function updatePkg(
  pkgPath: string,
  obj: {[key: string]: unknown},
): Promise<void> {
  const pkg = JSON.parse(await fs.readFile(pkgPath, 'utf8')) as {
    [key: string]: unknown;
  };
  const newPkg = Object.assign(pkg, obj);

  await fs.mkdir(path.dirname(pkgPath), {recursive: true});
  await fs.writeFile(pkgPath, `${JSON.stringify(newPkg, null, 2)}\n`);
}

// No need for fs-extra dependency
export async function pathExists(filePath: string): Promise<boolean> {
  return fs
    .access(filePath, fs.constants.F_OK)
    .then(() => true)
    .catch(() => false);
}

// The command that runs a package.json script. nub has no implicit script
// shortcut, so every script needs an explicit "run". npm/bun need it too,
// except for the "start" lifecycle script; yarn/pnpm never need it.
export function packageManagerScriptCommand(
  pkgManager: PackageManager,
  script: string,
): string {
  const needsRun =
    pkgManager === 'nub' ||
    ((pkgManager === 'npm' || pkgManager === 'bun') && script !== 'start');
  return `${pkgManager} ${needsRun ? 'run ' : ''}${script}`;
}

export function printPackageManagerHelp({
  pkgManager,
  cdpath,
}: {
  pkgManager: PackageManager;
  cdpath: string;
}) {
  const script = (name: string) =>
    packageManagerScriptCommand(pkgManager, name);
  logger.success`Created name=${cdpath}.`;
  logger.info`Inside that directory, you can run several commands:

  code=${script('start')}
    Starts the development server.

  code=${script('build')}
    Bundles your website into static files for production.

  code=${script('serve')}
    Serves the built website locally.

  code=${script('deploy')}
    Publishes the website to GitHub pages.

We recommend that you begin by typing:

  code=${`cd ${cdpath}`}
  code=${script('start')}

Happy building awesome websites!
`;
}
