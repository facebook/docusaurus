/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import loadSidebars from '../sidebars';
import loadSetup from '../../../docusaurus/lib/server/load/__tests__/loadSetup';

/* eslint-disable global-require, import/no-dynamic-require */

describe('loadSidebars', () => {
  const fixtures = path.join(__dirname, '..', '__fixtures__');

  test('normal site with sidebars', async () => {
    const {siteDir} = await loadSetup('simple');
    const sidebar = require(path.join(siteDir, 'sidebars.json'));
    const result = loadSidebars({siteDir, sidebar});
    expect(result).toMatchSnapshot();
  });

  test('site without sidebars', () => {
    const siteDir = path.join(fixtures, 'bad-site');
    const result = loadSidebars({siteDir, sidebar: {}});
    expect(result).toMatchSnapshot();
  });
});
