/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import {loadPlugins, sortConfig} from '..';
import type {RouteConfig} from '@docusaurus/types';

describe('loadPlugins', () => {
  it('loads plugins', async () => {
    const siteDir = path.join(__dirname, '__fixtures__/site-with-plugin');
    await expect(
      loadPlugins({
        pluginConfigs: [
          () => ({
            name: 'test1',
            prop: 'a',
            async loadContent() {
              // Testing that plugin lifecycle is bound to the plugin instance
              return this.prop;
            },
            async contentLoaded({content, actions}) {
              actions.setGlobalData({content, prop: this.prop});
            },
          }),
          () => ({
            name: 'test2',
            configureWebpack() {
              return {};
            },
          }),
        ],

        context: {
          siteDir,
          generatedFilesDir: path.join(siteDir, '.docusaurus'),
          outDir: path.join(siteDir, 'build'),
          // @ts-expect-error: good enough
          siteConfig: {
            baseUrl: '/',
            trailingSlash: true,
            themeConfig: {},
          },

          siteConfigPath: path.join(siteDir, 'docusaurus.config.js'),
        },
      }),
    ).resolves.toMatchSnapshot();
  });
});

describe('sortConfig', () => {
  it('sorts route config correctly', () => {
    const routes: RouteConfig[] = [
      {
        path: '/',
        component: '',
        routes: [
          {path: '/someDoc', component: ''},
          {path: '/someOtherDoc', component: ''},
        ],
      },
      {
        path: '/',
        component: '',
      },
      {
        path: '/',
        component: '',
        routes: [{path: '/subroute', component: ''}],
      },
      {
        path: '/docs',
        component: '',
        routes: [
          {path: '/docs/someDoc', component: ''},
          {path: '/docs/someOtherDoc', component: ''},
        ],
      },
      {
        path: '/community',
        component: '',
      },
      {
        path: '/some-page',
        component: '',
      },
    ];

    sortConfig(routes);

    expect(routes).toMatchSnapshot();
  });

  it('sorts route config given a baseURL', () => {
    const baseURL = '/latest/';
    const routes: RouteConfig[] = [
      {
        path: baseURL,
        component: '',
        routes: [
          {path: `${baseURL}someDoc`, component: ''},
          {path: `${baseURL}someOtherDoc`, component: ''},
        ],
      },
      {
        path: `${baseURL}example`,
        component: '',
      },
      {
        path: `${baseURL}docs`,
        component: '',
        routes: [
          {path: `${baseURL}docs/someDoc`, component: ''},
          {path: `${baseURL}docs/someOtherDoc`, component: ''},
        ],
      },
      {
        path: `${baseURL}community`,
        component: '',
      },
      {
        path: `${baseURL}some-page`,
        component: '',
      },
      {
        path: `${baseURL}`,
        component: '',
      },
    ];

    sortConfig(routes, baseURL);

    expect(routes).toMatchSnapshot();
  });
});
