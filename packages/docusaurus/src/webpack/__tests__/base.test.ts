/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {jest} from '@jest/globals';
import path from 'path';
import _ from 'lodash';
import * as utils from '@docusaurus/utils/lib/webpackUtils';
import {posixPath} from '@docusaurus/utils';
import {excludeJS, clientDir, createBaseConfig} from '../base';
import type {Props} from '@docusaurus/types';

describe('babel transpilation exclude logic', () => {
  it('always transpiles client dir files', () => {
    const clientFiles = [
      'App.js',
      'clientEntry.js',
      'serverEntry.js',
      path.join('exports', 'Link.js'),
    ];
    clientFiles.forEach((file) => {
      expect(excludeJS(path.join(clientDir, file))).toBe(false);
    });
  });

  it('always transpiles non node_module files', () => {
    const moduleFiles = [
      '/pages/user/App.jsx',
      '/website/src/components/foo.js',
      '/src/theme/SearchBar/index.js',
    ];
    moduleFiles.forEach((file) => {
      expect(excludeJS(file)).toBe(false);
    });
  });

  it('transpiles docusaurus npm packages even in node_modules', () => {
    const moduleFiles = [
      '/website/node_modules/docusaurus-theme-search/theme/Navbar/index.js',
      'node_modules/@docusaurus/theme-classic/theme/Layout.js',
      '/docusaurus/website/node_modules/@docusaurus/theme-search-algolia/theme/SearchBar.js',
    ];
    moduleFiles.forEach((file) => {
      expect(excludeJS(file)).toBe(false);
    });
  });

  it('does not transpile node_modules', () => {
    const moduleFiles = [
      'node_modules/react-toggle.js',
      '/website/node_modules/react-trend/index.js',
      '/docusaurus/website/node_modules/react-super.js',
      '/docusaurus/website/node_modules/@docusaurus/core/node_modules/core-js/modules/_descriptors.js',
      'node_modules/docusaurus-theme-classic/node_modules/react-slick/index.js',
    ];
    moduleFiles.forEach((file) => {
      expect(excludeJS(file)).toBe(true);
    });
  });
});

describe('base webpack config', () => {
  const props = {
    outDir: '',
    siteDir: path.resolve(__dirname, '__fixtures__', 'base_test_site'),
    siteConfig: {staticDirectories: ['static'], future: {}},
    baseUrl: '',
    generatedFilesDir: '',
    routesPaths: [''],
    i18n: {
      currentLocale: 'en',
    },
    siteMetadata: {
      docusaurusVersion: '2.0.0-alpha.70',
    },
    plugins: [
      {
        getThemePath() {
          return path.resolve(
            __dirname,
            '__fixtures__',
            'base_test_site',
            'pluginThemeFolder',
          );
        },
      },
      {
        getThemePath() {
          return path.resolve(
            __dirname,
            '__fixtures__',
            'base_test_site',
            'secondPluginThemeFolder',
          );
        },
      },
    ],
  } as Props;

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('creates webpack aliases', async () => {
    const aliases = ((
      await createBaseConfig({props, isServer: true, minify: true})
    ).resolve?.alias ?? {}) as {[alias: string]: string};
    // Make aliases relative so that test work on all computers
    const relativeAliases = _.mapValues(aliases, (a) =>
      posixPath(path.relative(props.siteDir, a)),
    );
    expect(relativeAliases).toMatchSnapshot();
  });

  it('uses svg rule', async () => {
    const fileLoaderUtils = utils.getFileLoaderUtils();
    const mockSvg = jest.spyOn(fileLoaderUtils.rules, 'svg');
    jest
      .spyOn(utils, 'getFileLoaderUtils')
      .mockImplementation(() => fileLoaderUtils);

    await createBaseConfig({props, isServer: false, minify: false});
    expect(mockSvg).toHaveBeenCalled();
  });
});
