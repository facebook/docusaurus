/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {describe, expect, it} from 'vitest';
import path from 'node:path';
import _ from 'lodash';
import {posixPath} from '@docusaurus/utils';
import {getCurrentBundler} from '@docusaurus/bundler';
import {excludeJS, clientDir, createBaseConfig} from '../base';
import {BundlerNames, createTestConfigureWebpackUtils} from './testUtils';
import {DEFAULT_FUTURE_CONFIG} from '../../server/configValidation';
import type {CurrentBundler, Props} from '@docusaurus/types';

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
    siteConfig: {staticDirectories: ['static'], future: DEFAULT_FUTURE_CONFIG},
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
  } as Omit<Props, 'currentBundler'>;

  async function createProps(
    bundlerName: CurrentBundler['name'] = 'rspack',
  ): Promise<Props> {
    const siteConfig = {
      ...props.siteConfig,
      webpack: bundlerName === 'webpack' ? {} : undefined,
    };
    return {
      ...props,
      siteConfig,
      currentBundler: await getCurrentBundler({siteConfig}),
    };
  }

  // Rspack and webpack have a default rule giving the 'asset/source' type to
  // modules imported with `with {type: 'text'}`, but the loaders of all other
  // matching rules still apply (JS transpilation, MDX compilation, SVGR...)
  // Our rules must exclude text imports to return the raw file content
  // See https://rspack.rs/config/module-rules#ruleswith
  it.each(BundlerNames)(
    'excludes text import attributes from all core rules - %s',
    async (bundlerName) => {
      const config = await createBaseConfig({
        props: await createProps(bundlerName),
        isServer: false,
        minify: true,
        configureWebpackUtils:
          await createTestConfigureWebpackUtils(bundlerName),
      });
      const rules = config.module?.rules ?? [];
      expect(rules.length).toBeGreaterThan(0);
      rules.forEach((rule) => {
        expect(rule).toMatchObject({with: {type: {not: 'text'}}});
      });
    },
  );

  it('creates webpack aliases', async () => {
    const aliases = ((
      await createBaseConfig({
        props: await createProps(),
        isServer: true,
        minify: true,
        configureWebpackUtils: await createTestConfigureWebpackUtils(),
      })
    ).resolve?.alias ?? {}) as {[alias: string]: string};
    // Make aliases relative so that test work on all computers
    const relativeAliases = _.mapValues(aliases, (a) =>
      posixPath(path.relative(props.siteDir, a)),
    );
    expect(relativeAliases).toMatchSnapshot();
  });
});
