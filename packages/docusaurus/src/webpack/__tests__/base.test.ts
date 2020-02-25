/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';

import {excludeJS, clientDir} from '../base';

describe('babel transpilation exclude logic', () => {
  test('always transpile client dir files', () => {
    const clientFiles = [
      'App.js',
      'clientEntry.js',
      'serverEntry.js',
      path.join('exports', 'Link.js'),
    ];
    clientFiles.forEach(file => {
      expect(excludeJS(path.join(clientDir, file))).toEqual(false);
    });
  });

  test('always transpile non node_module files', () => {
    const moduleFiles = [
      '/pages/user/App.jsx',
      '/website/src/components/foo.js',
      '/src/theme/SearchBar/index.js',
    ];
    moduleFiles.forEach(file => {
      expect(excludeJS(file)).toEqual(false);
    });
  });

  test('transpile docusaurus npm packages even in node_modules', () => {
    const moduleFiles = [
      '/website/node_modules/docusaurus-theme-search/theme/Navbar/index.js',
      'node_modules/@docusaurus/theme-classic/theme/Layout.js',
      '/docusaurus/website/node_modules/@docusaurus/theme-search-algolia/theme/SearchBar.js',
    ];
    moduleFiles.forEach(file => {
      expect(excludeJS(file)).toEqual(false);
    });
  });

  test('does not transpile node_modules', () => {
    const moduleFiles = [
      'node_modules/react-toggle.js',
      '/website/node_modules/react-trend/index.js',
      '/docusaurus/website/node_modules/react-super.js',
      '/docusaurus/website/node_modules/@docusaurus/core/node_modules/core-js/modules/_descriptors.js',
      'node_modules/docusaurus-theme-classic/node_modules/react-daypicker/index.js',
    ];
    moduleFiles.forEach(file => {
      expect(excludeJS(file)).toEqual(true);
    });
  });
});
