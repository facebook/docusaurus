/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import fs from 'fs-extra';
import themeAlias from '../alias';

describe('themeAlias', () => {
  test('valid themePath 1 with components', () => {
    const fixtures = path.join(__dirname, '__fixtures__');
    const themePath = path.join(fixtures, 'theme-1');
    const alias = themeAlias(themePath, true);
    // Testing entries, because order matters!
    expect(Object.entries(alias)).toEqual(
      Object.entries({
        '@theme-original/Footer': path.join(themePath, 'Footer/index.js'),
        '@theme-original/Layout': path.join(themePath, 'Layout.js'),
        '@theme/Footer': path.join(themePath, 'Footer/index.js'),
        '@theme/Layout': path.join(themePath, 'Layout.js'),
      }),
    );
    expect(alias).not.toEqual({});
  });

  test('valid themePath 1 with components without original', () => {
    const fixtures = path.join(__dirname, '__fixtures__');
    const themePath = path.join(fixtures, 'theme-1');
    const alias = themeAlias(themePath, false);
    // Testing entries, because order matters!
    expect(Object.entries(alias)).toEqual(
      Object.entries({
        '@theme/Footer': path.join(themePath, 'Footer/index.js'),
        '@theme/Layout': path.join(themePath, 'Layout.js'),
      }),
    );
    expect(alias).not.toEqual({});
  });

  test('valid themePath 2 with components', () => {
    const fixtures = path.join(__dirname, '__fixtures__');
    const themePath = path.join(fixtures, 'theme-2');
    const alias = themeAlias(themePath, true);
    // Testing entries, because order matters!
    expect(Object.entries(alias)).toEqual(
      Object.entries({
        '@theme-original/Layout': path.join(themePath, 'Layout/index.js'),
        '@theme-original/Navbar': path.join(themePath, 'Navbar.js'),
        '@theme-original/NavbarItem/NestedNavbarItem': path.join(
          themePath,
          'NavbarItem/NestedNavbarItem/index.js',
        ),
        '@theme-original/NavbarItem/SiblingNavbarItem': path.join(
          themePath,
          'NavbarItem/SiblingNavbarItem.js',
        ),
        '@theme-original/NavbarItem/zzz': path.join(
          themePath,
          'NavbarItem/zzz.js',
        ),
        '@theme-original/NavbarItem': path.join(
          themePath,
          'NavbarItem/index.js',
        ),

        '@theme/Layout': path.join(themePath, 'Layout/index.js'),
        '@theme/Navbar': path.join(themePath, 'Navbar.js'),
        '@theme/NavbarItem/NestedNavbarItem': path.join(
          themePath,
          'NavbarItem/NestedNavbarItem/index.js',
        ),
        '@theme/NavbarItem/SiblingNavbarItem': path.join(
          themePath,
          'NavbarItem/SiblingNavbarItem.js',
        ),
        '@theme/NavbarItem/zzz': path.join(themePath, 'NavbarItem/zzz.js'),
        '@theme/NavbarItem': path.join(themePath, 'NavbarItem/index.js'),
      }),
    );
    expect(alias).not.toEqual({});
  });

  test('valid themePath 2 with components without original', () => {
    const fixtures = path.join(__dirname, '__fixtures__');
    const themePath = path.join(fixtures, 'theme-2');
    const alias = themeAlias(themePath, false);
    // Testing entries, because order matters!
    expect(Object.entries(alias)).toEqual(
      Object.entries({
        '@theme/Layout': path.join(themePath, 'Layout/index.js'),
        '@theme/Navbar': path.join(themePath, 'Navbar.js'),
        '@theme/NavbarItem/NestedNavbarItem': path.join(
          themePath,
          'NavbarItem/NestedNavbarItem/index.js',
        ),
        '@theme/NavbarItem/SiblingNavbarItem': path.join(
          themePath,
          'NavbarItem/SiblingNavbarItem.js',
        ),
        '@theme/NavbarItem/zzz': path.join(themePath, 'NavbarItem/zzz.js'),
        '@theme/NavbarItem': path.join(themePath, 'NavbarItem/index.js'),
      }),
    );
    expect(alias).not.toEqual({});
  });

  test('valid themePath with no components', () => {
    const fixtures = path.join(__dirname, '__fixtures__');
    const themePath = path.join(fixtures, 'empty-theme');
    fs.ensureDirSync(themePath);
    const alias = themeAlias(themePath, true);
    expect(alias).toEqual({});
  });

  test('valid themePath with no components without original', () => {
    const fixtures = path.join(__dirname, '__fixtures__');
    const themePath = path.join(fixtures, 'empty-theme');
    fs.ensureDirSync(themePath);
    const alias = themeAlias(themePath, false);
    expect(alias).toEqual({});
  });

  test('invalid themePath that does not exist', () => {
    const fixtures = path.join(__dirname, '__fixtures__');
    const themePath = path.join(fixtures, '__noExist__');
    const alias = themeAlias(themePath, true);
    expect(alias).toEqual({});
  });
});
