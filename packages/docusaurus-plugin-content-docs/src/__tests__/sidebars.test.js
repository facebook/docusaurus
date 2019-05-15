/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import loadSidebars from '../sidebars';

/* eslint-disable global-require, import/no-dynamic-require */

describe('loadSidebars', () => {
  test('normal site with sidebars', async () => {
    const sidebarPath = path.join(
      __dirname,
      '__fixtures__',
      'website',
      'sidebars.json',
    );
    const result = loadSidebars(sidebarPath);
    expect(result).toMatchSnapshot();
  });

  test('site without sidebars', () => {
    const result = loadSidebars(null);
    expect(result).toMatchSnapshot();
  });
});
