/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import {loadPlugins} from '..';

describe('loadPlugins', () => {
  it('loads plugins', async () => {
    const siteDir = path.join(__dirname, '__fixtures__/site-with-plugin');
    await expect(
      loadPlugins({
        siteDir,
        generatedFilesDir: path.join(siteDir, '.docusaurus'),
        outDir: path.join(siteDir, 'build'),
        // @ts-expect-error: good enough
        siteConfig: {
          baseUrl: '/',
          trailingSlash: true,
          themeConfig: {},
          presets: [],
          plugins: [
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
      }),
    ).resolves.toMatchSnapshot();
  });
});
