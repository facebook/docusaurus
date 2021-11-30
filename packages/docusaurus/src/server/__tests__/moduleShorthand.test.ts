/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {getNamePatterns} from '../moduleShorthand';

describe('getNamePatterns', () => {
  test('should resolve plain names', () => {
    expect(getNamePatterns('awesome', 'plugin')).toEqual([
      'awesome',
      '@docusaurus/plugin-awesome',
      'docusaurus-plugin-awesome',
    ]);

    expect(getNamePatterns('awesome', 'theme')).toEqual([
      'awesome',
      '@docusaurus/theme-awesome',
      'docusaurus-theme-awesome',
    ]);
  });

  test('should expand bare scopes', () => {
    expect(getNamePatterns('@joshcena', 'plugin')).toEqual([
      '@joshcena/docusaurus-plugin',
    ]);

    expect(getNamePatterns('@joshcena', 'theme')).toEqual([
      '@joshcena/docusaurus-theme',
    ]);
  });

  test('should expand scoped names', () => {
    expect(getNamePatterns('@joshcena/awesome', 'plugin')).toEqual([
      '@joshcena/awesome',
      '@joshcena/docusaurus-plugin-awesome',
    ]);

    expect(getNamePatterns('@joshcena/awesome', 'theme')).toEqual([
      '@joshcena/awesome',
      '@joshcena/docusaurus-theme-awesome',
    ]);
  });

  test('should expand deep scoped paths', () => {
    expect(getNamePatterns('@joshcena/awesome/web', 'plugin')).toEqual([
      '@joshcena/awesome/web',
      '@joshcena/docusaurus-plugin-awesome/web',
    ]);

    expect(getNamePatterns('@joshcena/awesome/web', 'theme')).toEqual([
      '@joshcena/awesome/web',
      '@joshcena/docusaurus-theme-awesome/web',
    ]);
  });
});
