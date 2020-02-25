/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import {loadThemeAlias} from '../index';

describe('loadThemeAlias', () => {
  test('next alias can override the previous alias', () => {
    const fixtures = path.join(__dirname, '__fixtures__');
    const theme1Path = path.join(fixtures, 'theme-1');
    const theme2Path = path.join(fixtures, 'theme-2');

    const alias = loadThemeAlias([theme1Path, theme2Path]);
    expect(alias).toEqual({
      '@theme/Footer': path.join(theme1Path, 'Footer/index.js'),
      '@theme/Navbar': path.join(theme2Path, 'Navbar.js'),
      '@theme/Layout': path.join(theme2Path, 'Layout/index.js'),
    });
    expect(alias).not.toEqual({});
  });
});
