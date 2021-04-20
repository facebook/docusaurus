/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';

import {loadContext} from '@docusaurus/core/src/server/index';

describe('functional plugin', () => {
  async function loadSite() {
    const siteDir = path.join(__dirname, '__fixtures__', 'site-with-plugin');
    const context = await loadContext(siteDir);

    return {siteDir, context};
  }

  test('plugin gets parsed correctly and loads', async () => {
    const {context} = await loadSite();
    expect(context.siteConfig.plugins.length).toBe(3);
  });

  test('plugin should load in order', async () => {
    const {context} = await loadSite();
    const {plugins} = context.siteConfig;
    expect(
      typeof plugins[0] === 'function' ? plugins[0](context, {}).name : null,
    ).toBe('first-plugin');
    expect(
      typeof plugins[1][0] === 'function'
        ? plugins[1][0](context, {}).name
        : null,
    ).toBe('second-plugin');
  });
});
