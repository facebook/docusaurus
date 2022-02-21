/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {migrateDocusaurusProject} from '../index';
import path from 'path';
import fs from 'fs-extra';

describe('migration test', () => {
  test('simple website', async () => {
    const siteDir = path.join(
      __dirname,
      '__fixtures__',
      'simple_website',
      'website',
    );
    const newDir = path.join(__dirname, '__fixtures__', 'migrated_simple_site');
    await expect(
      migrateDocusaurusProject(siteDir, newDir),
    ).resolves.toBeUndefined();
    await fs.remove(newDir);
  });
  test('complex website', async () => {
    const siteDir = path.join(
      __dirname,
      '__fixtures__',
      'complex_website',
      'website',
    );
    const newDir = path.join(
      __dirname,
      '__fixtures__',
      'migrated_complex_site',
    );
    await expect(
      migrateDocusaurusProject(siteDir, newDir),
    ).resolves.toBeUndefined();
    await fs.remove(newDir);
  });

  test('missing versions', async () => {
    const siteDir = path.join(
      __dirname,
      '__fixtures__',
      'missing_version_website',
      'website',
    );
    const newDir = path.join(
      __dirname,
      '__fixtures__',
      'migrated_missing_version_site',
    );
    await expect(
      migrateDocusaurusProject(siteDir, newDir),
    ).resolves.toBeUndefined();
    await fs.remove(newDir);
  });
});
