/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import {loadThemeAliases} from '../index';

describe('loadThemeAliases', () => {
  test('next alias can override the previous alias', () => {
    const fixtures = path.join(__dirname, '__fixtures__');
    const theme1Path = path.join(fixtures, 'theme-1');
    const theme2Path = path.join(fixtures, 'theme-2');

    const alias = loadThemeAliases([theme1Path, theme2Path]);

    // Testing entries, because order matters!
    expect(Object.entries(alias)).toEqual(
      Object.entries({
        '@theme-init/Layout': path.join(theme1Path, 'Layout.js'),

        '@theme-original/Footer': path.join(theme1Path, 'Footer/index.js'),
        '@theme-original/Layout': path.join(theme2Path, 'Layout/index.js'),
        '@theme-original/Navbar': path.join(theme2Path, 'Navbar.js'),
        '@theme-original/NavbarItem/NestedNavbarItem': path.join(
          theme2Path,
          'NavbarItem/NestedNavbarItem/index.js',
        ),
        '@theme-original/NavbarItem/SiblingNavbarItem': path.join(
          theme2Path,
          'NavbarItem/SiblingNavbarItem.js',
        ),
        '@theme-original/NavbarItem/zzz': path.join(
          theme2Path,
          'NavbarItem/zzz.js',
        ),
        '@theme-original/NavbarItem': path.join(
          theme2Path,
          'NavbarItem/index.js',
        ),

        '@theme/Footer': path.join(theme1Path, 'Footer/index.js'),
        '@theme/Layout': path.join(theme2Path, 'Layout/index.js'),
        '@theme/Navbar': path.join(theme2Path, 'Navbar.js'),
        '@theme/NavbarItem/NestedNavbarItem': path.join(
          theme2Path,
          'NavbarItem/NestedNavbarItem/index.js',
        ),
        '@theme/NavbarItem/SiblingNavbarItem': path.join(
          theme2Path,
          'NavbarItem/SiblingNavbarItem.js',
        ),
        '@theme/NavbarItem/zzz': path.join(theme2Path, 'NavbarItem/zzz.js'),
        '@theme/NavbarItem': path.join(theme2Path, 'NavbarItem/index.js'),
      }),
    );
    expect(alias).not.toEqual({});
  });
});
