/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';

import {loadContext, type LoadContextOptions} from '../../index';
import {initPlugins} from '../init';

describe('initPlugins', () => {
  async function loadSite(options: Omit<LoadContextOptions, 'siteDir'> = {}) {
    const siteDir = path.join(__dirname, '__fixtures__', 'site-with-plugin');
    const context = await loadContext({...options, siteDir});
    const plugins = await initPlugins(context);

    return {siteDir, context, plugins};
  }

  it('parses plugins correctly and loads them in correct order', async () => {
    const {context, plugins} = await loadSite();
    expect(context.siteConfig.plugins).toHaveLength(4);
    expect(plugins).toHaveLength(8);

    expect(plugins[0]!.name).toBe('preset-plugin1');
    expect(plugins[1]!.name).toBe('preset-plugin2');
    expect(plugins[2]!.name).toBe('preset-theme1');
    expect(plugins[3]!.name).toBe('preset-theme2');
    expect(plugins[4]!.name).toBe('first-plugin');
    expect(plugins[5]!.name).toBe('second-plugin');
    expect(plugins[6]!.name).toBe('third-plugin');
    expect(plugins[7]!.name).toBe('fourth-plugin');
    expect(context.siteConfig.themeConfig).toEqual({a: 1});
  });

  it('throws user-friendly error message for plugins with bad values', async () => {
    await expect(() =>
      loadSite({config: 'badPlugins.docusaurus.config.js'}),
    ).rejects.toThrowErrorMatchingSnapshot();
  });
});
