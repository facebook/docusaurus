/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import util from 'util';
import globCb from 'glob';
import fsCb from 'fs';

const glob = util.promisify(globCb);
const readFile = util.promisify(fsCb.readFile);

type PackageJsonFile = {
  file: string;
  content: any;
};

async function getPackagesJsonFiles(): Promise<PackageJsonFile[]> {
  const files = await glob('packages/*/package.json');
  return Promise.all(
    files.map(async (file) => {
      return {
        file,
        content: JSON.parse(await readFile(file, 'utf8')),
      };
    }),
  );
}

describe('packages', () => {
  test('should be found', async () => {
    const packageJsonFiles = await getPackagesJsonFiles();
    expect(packageJsonFiles.length).toBeGreaterThan(0);
  });

  test('should contain repository and directory for every package', async () => {
    const packageJsonFiles = await getPackagesJsonFiles();

    packageJsonFiles.forEach((packageJsonFile) => {
      if (packageJsonFile.content.private !== true) {
        expect(packageJsonFile.content.repository).toEqual({
          type: 'git',
          url: 'https://github.com/facebook/docusaurus.git',
          directory: packageJsonFile.file.replace(/\/package\.json$/, ''),
        });
      }
    });
  });

  /*
  If a package starts with @, if won't be published to public npm registry
  without an additional publishConfig.acces: "public" config
  This will make you publish an incomplete list of Docusaurus packages
  when trying to release with lerna-publish
   */
  test('should have publishConfig.access: "public" when name starts with @', async () => {
    const packageJsonFiles = await getPackagesJsonFiles();

    packageJsonFiles.forEach((packageJsonFile) => {
      if (packageJsonFile.content.name.startsWith('@')) {
        // Unfortunately jest custom message do not exist in loops, so using an exception instead to show failing package file
        // (see https://github.com/facebook/jest/issues/3293)
        // expect(packageJsonFile.content.publishConfig?.access).toEqual('public');
        if (packageJsonFile.content.publishConfig?.access !== 'public') {
          throw new Error(
            `Package ${packageJsonFile.file} does not have publishConfig.access: 'public'`,
          );
        }
      }
    });
  });
});
