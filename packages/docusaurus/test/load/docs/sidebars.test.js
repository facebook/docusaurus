/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import loadSidebars from '@lib/load/docs/sidebars';
import loadSetup from '../../loadSetup';

describe('loadSidebars', () => {
  const fixtures = path.join(__dirname, '..', '__fixtures__');
  test('normal site with sidebars', async () => {
    const {env, siteDir} = await loadSetup('simple');
    const result = loadSidebars({siteDir, env});
    expect(result).toMatchSnapshot();
  });

  test('site without sidebars', () => {
    const env = {};
    const siteDir = path.join(fixtures, 'bad-site');
    const result = loadSidebars({siteDir, env});
    expect(result).toMatchSnapshot();
  });

  test('site with sidebars & versioned sidebars', async () => {
    const {env, siteDir} = await loadSetup('versioned');
    const result = loadSidebars({siteDir, env});
    expect(result).toMatchSnapshot();
  });

  test('site with missing versioned sidebars', async () => {
    const env = {
      versioning: {
        enabled: true,
        versions: ['2.0.0'],
      },
    };
    const {siteDir} = await loadSetup('versioned');
    expect(() => {
      loadSidebars({siteDir, env});
    }).toThrowErrorMatchingInlineSnapshot(
      `"Failed to load versioned_sidebars/version-2.0.0-sidebars.json. It does not exist."`,
    );
  });
});
