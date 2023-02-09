/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import {Globby} from '@docusaurus/utils';

type PackageJsonFile = {
  file: string;
  content: {
    name?: string;
    private?: boolean;
    version?: string;
    repository?: {
      type?: string;
      url?: string;
      directory?: string;
    };
    publishConfig?: {
      access?: string;
    };
  };
};

async function getPackagesJsonFiles(): Promise<PackageJsonFile[]> {
  const files = await Globby('packages/*/package.json');
  return Promise.all(
    files.map((file) =>
      fs
        .readJSON(file)
        .then((content: PackageJsonFile['content']) => ({file, content})),
    ),
  );
}

describe('packages', () => {
  it('are found', async () => {
    const packageJsonFiles = await getPackagesJsonFiles();
    expect(packageJsonFiles.length).toBeGreaterThan(0);
  });

  it('contain repository and directory', async () => {
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
  without an additional publishConfig.access: "public" config
  This will make you publish an incomplete list of Docusaurus packages
  when trying to release with lerna-publish
   */
  it('have publishConfig.access: "public" when name starts with @', async () => {
    const packageJsonFiles = await getPackagesJsonFiles();

    packageJsonFiles
      .filter((packageJsonFile) =>
        packageJsonFile.content.name?.startsWith('@'),
      )
      .forEach((packageJsonFile) => {
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
      });
  });
});
