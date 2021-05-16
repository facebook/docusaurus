/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';

import {loadContext, LoadContextOptions, loadPluginConfigs} from '../../index';
import initPlugins from '../init';

describe('initPlugins', () => {
  async function loadSite(options: LoadContextOptions = {}) {
    const siteDir = path.join(__dirname, '__fixtures__', 'site-with-plugin');
    const context = await loadContext(siteDir, options);
    const pluginConfigs = loadPluginConfigs(context);
    const plugins = initPlugins({
      pluginConfigs,
      context,
    });

    return {siteDir, context, plugins};
  }

  test('plugins gets parsed correctly and loads in correct order', async () => {
    const {context, plugins} = await loadSite();
    expect(context.siteConfig.plugins?.length).toBe(4);
    expect(plugins.length).toBe(4);

    expect(plugins[0].name).toBe('first-plugin');
    expect(plugins[1].name).toBe('second-plugin');
    expect(plugins[2].name).toBe('third-plugin');
    expect(plugins[3].name).toBe('fourth-plugin');
  });

  test('plugins with bad values throw user-friendly error message', async () => {
    await expect(() =>
      loadSite({
        customConfigFilePath: 'badPlugins.docusaurus.config.js',
      }),
    ).rejects.toThrowErrorMatchingSnapshot();
  });
});
