/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import {loadPlugins} from '..';
import type {Plugin, Props} from '@docusaurus/types';

describe('loadPlugins', () => {
  it('loads plugins', async () => {
    const siteDir = path.join(__dirname, '__fixtures__/site-with-plugin');
    await expect(
      loadPlugins({
        siteDir,
        generatedFilesDir: path.join(siteDir, '.docusaurus'),
        outDir: path.join(siteDir, 'build'),
        siteConfig: {
          baseUrl: '/',
          trailingSlash: true,
          themeConfig: {},
          presets: [],
          plugins: [
            () =>
              ({
                name: 'test1',
                prop: 'a',
                async loadContent() {
                  // Testing that plugin lifecycle is bound to the instance
                  return this.prop;
                },
                async contentLoaded({content, actions}) {
                  actions.addRoute({
                    path: 'foo',
                    component: 'Comp',
                    modules: {content: 'path'},
                    context: {content: 'path'},
                  });
                  actions.setGlobalData({content, prop: this.prop});
                },
              } as Plugin & ThisType<{prop: 'a'}>),
          ],
          themes: [
            () => ({
              name: 'test2',
              configureWebpack() {
                return {};
              },
            }),
          ],
        },
        siteConfigPath: path.join(siteDir, 'docusaurus.config.js'),
      } as unknown as Props),
    ).resolves.toMatchSnapshot();
  });
});
