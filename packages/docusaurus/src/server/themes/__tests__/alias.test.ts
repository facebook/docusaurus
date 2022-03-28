/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import fs from 'fs-extra';
import {themeAlias, sortAliases} from '../alias';

describe('sortAliases', () => {
  // https://github.com/facebook/docusaurus/issues/6878
  // Not sure if the risk actually happens, but still made tests to ensure that
  // behavior is consistent
  it('sorts reliably', () => {
    expect(
      Object.values(
        sortAliases({
          '@a/b': 'b',
          '@a/b/c': 'c',
          '@a/b/c/d': 'd',
        }),
      ),
    ).toEqual(['d', 'c', 'b']);
    expect(
      Object.values(
        sortAliases({
          '@a/b': 'b',
          '@a/b/c/d': 'd',
          '@a/b/c': 'c',
        }),
      ),
    ).toEqual(['d', 'c', 'b']);
    expect(
      Object.values(
        sortAliases({
          '@a/b/c/d': 'd',
          '@a/b/c': 'c',
          '@a/b': 'b',
        }),
      ),
    ).toEqual(['d', 'c', 'b']);
    expect(
      Object.values(
        sortAliases({
          '@a/b/c': 'c',
          '@a/b': 'b',
          '@a/b/c/d': 'd',
        }),
      ),
    ).toEqual(['d', 'c', 'b']);
  });
});

describe('themeAlias', () => {
  it('valid themePath 1 with components', async () => {
    const fixtures = path.join(__dirname, '__fixtures__');
    const themePath = path.join(fixtures, 'theme-1');
    const alias = await themeAlias(themePath, true);
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

  it('valid themePath 1 with components without original', async () => {
    const fixtures = path.join(__dirname, '__fixtures__');
    const themePath = path.join(fixtures, 'theme-1');
    const alias = await themeAlias(themePath, false);
    // Testing entries, because order matters!
    expect(Object.entries(alias)).toEqual(
      Object.entries({
        '@theme/Footer': path.join(themePath, 'Footer/index.js'),
        '@theme/Layout': path.join(themePath, 'Layout.js'),
      }),
    );
    expect(alias).not.toEqual({});
  });

  it('valid themePath 2 with components', async () => {
    const fixtures = path.join(__dirname, '__fixtures__');
    const themePath = path.join(fixtures, 'theme-2');
    const alias = await themeAlias(themePath, true);
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

  it('valid themePath 2 with components without original', async () => {
    const fixtures = path.join(__dirname, '__fixtures__');
    const themePath = path.join(fixtures, 'theme-2');
    const alias = await themeAlias(themePath, false);
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

  it('valid themePath with no components', async () => {
    const fixtures = path.join(__dirname, '__fixtures__');
    const themePath = path.join(fixtures, 'empty-theme');
    await fs.ensureDir(themePath);
    const alias = await themeAlias(themePath, true);
    expect(alias).toEqual({});
  });

  it('valid themePath with no components without original', async () => {
    const fixtures = path.join(__dirname, '__fixtures__');
    const themePath = path.join(fixtures, 'empty-theme');
    await fs.ensureDir(themePath);
    const alias = await themeAlias(themePath, false);
    expect(alias).toEqual({});
  });

  it('invalid themePath that does not exist', async () => {
    const fixtures = path.join(__dirname, '__fixtures__');
    const themePath = path.join(fixtures, '__noExist__');
    const alias = await themeAlias(themePath, true);
    expect(alias).toEqual({});
  });
});
