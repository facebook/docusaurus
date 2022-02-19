/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/* eslint-disable import/no-extraneous-dependencies */

import {Globby} from '@docusaurus/utils';
import fs from 'fs-extra';

type PackageJsonFile = {
  file: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any;
};

async function getPackagesJsonFiles(): Promise<PackageJsonFile[]> {
  const files = await Globby('packages/*/package.json');

  return Promise.all(
    files.map(async (file) => ({
      file,
      content: JSON.parse(await fs.readFile(file, 'utf8')),
    })),
  );
}

describe('packages', () => {
  test('should be found', async () => {
    const packageJsonFiles = await getPackagesJsonFiles();
    expect(packageJsonFiles.length).toBeGreaterThan(0);
  });

  test('should contain repository and directory for every package', async () => {
    const packageJsonFiles = await getPackagesJsonFiles();

    packageJsonFiles
      .filter((packageJsonFile) => !packageJsonFile.content.private)
      .forEach((packageJsonFile) => {
        expect(packageJsonFile.content.repository).toEqual({
          type: 'git',
          url: 'https://github.com/facebook/docusaurus.git',
          directory: packageJsonFile.file.replace(/\/package\.json$/, ''),
        });
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

    packageJsonFiles
      .filter((packageJsonFile) => packageJsonFile.content.name.startsWith('@'))
      .forEach((packageJsonFile) => {
        if (packageJsonFile) {
          // Unfortunately jest custom message do not exist in loops,
          // so using an exception instead to show failing package file
          // (see https://github.com/facebook/jest/issues/3293)
          // expect(packageJsonFile.content.publishConfig?.access)
          //  .toEqual('public');
          if (packageJsonFile.content.publishConfig?.access !== 'public') {
            throw new Error(
              `Package ${packageJsonFile.file} does not have publishConfig.access: 'public'`,
            );
          }
        }
      });
  });
});
