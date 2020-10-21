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

describe('packages', () => {
  test('should contain repository and directory for every package', async () => {
    const allPackageJson = await glob('packages/*/package.json');
    expect(allPackageJson.length).toBeGreaterThan(0);

    /* eslint-disable no-await-in-loop,no-restricted-syntax */
    for (const packageJson of allPackageJson) {
      const content = JSON.parse(await readFile(packageJson, 'utf8'));
      if (content.private !== true) {
        expect(content.repository).toEqual({
          type: 'git',
          url: 'https://github.com/facebook/docusaurus.git',
          directory: packageJson.replace(/\/package\.json$/, ''),
        });
      }
    }
  });
});
