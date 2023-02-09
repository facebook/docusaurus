/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import {loadPresets} from '../presets';
import type {LoadContext} from '@docusaurus/types';

describe('loadPresets', () => {
  it('no presets', async () => {
    const context = {
      siteConfigPath: __dirname,
      siteConfig: {
        presets: [],
      },
    } as unknown as LoadContext;
    const presets = await loadPresets(context);
    expect(presets).toMatchInlineSnapshot(`
      {
        "plugins": [],
        "themes": [],
      }
    `);
  });

  it('string form', async () => {
    const context = {
      siteConfigPath: __dirname,
      siteConfig: {
        presets: [
          path.join(__dirname, '__fixtures__/presets/preset-plugins.js'),
        ],
      },
    } as LoadContext;
    const presets = await loadPresets(context);
    expect(presets).toMatchSnapshot();
  });

  it('string form composite', async () => {
    const context = {
      siteConfigPath: __dirname,
      siteConfig: {
        presets: [
          path.join(__dirname, '__fixtures__/presets/preset-plugins.js'),
          path.join(__dirname, '__fixtures__/presets/preset-themes.js'),
        ],
      },
    } as LoadContext;
    const presets = await loadPresets(context);
    expect(presets).toMatchSnapshot();
  });

  it('array form', async () => {
    const context = {
      siteConfigPath: __dirname,
      siteConfig: {
        presets: [
          [path.join(__dirname, '__fixtures__/presets/preset-plugins.js')],
        ],
      },
    } as unknown as LoadContext;
    const presets = await loadPresets(context);
    expect(presets).toMatchSnapshot();
  });

  it('array form with options', async () => {
    const context = {
      siteConfigPath: __dirname,
      siteConfig: {
        presets: [
          [
            path.join(__dirname, '__fixtures__/presets/preset-plugins.js'),
            {docs: {path: '../'}},
          ],
        ],
      },
    } as unknown as LoadContext;
    const presets = await loadPresets(context);
    expect(presets).toMatchSnapshot();
  });

  it('array form composite', async () => {
    const context = {
      siteConfigPath: __dirname,
      siteConfig: {
        presets: [
          [
            path.join(__dirname, '__fixtures__/presets/preset-plugins.js'),
            {docs: {path: '../'}},
          ],
          [
            path.join(__dirname, '__fixtures__/presets/preset-themes.js'),
            {algolia: {trackingID: 'foo'}},
          ],
        ],
      },
    } as unknown as LoadContext;
    const presets = await loadPresets(context);
    expect(presets).toMatchSnapshot();
  });

  it('mixed form', async () => {
    const context = {
      siteConfigPath: __dirname,
      siteConfig: {
        presets: [
          [
            path.join(__dirname, '__fixtures__/presets/preset-plugins.js'),
            {docs: {path: '../'}},
          ],
          path.join(__dirname, '__fixtures__/presets/preset-themes.js'),
        ],
      },
    } as LoadContext;
    const presets = await loadPresets(context);
    expect(presets).toMatchSnapshot();
  });

  it('mixed form with themes', async () => {
    const context = {
      siteConfigPath: __dirname,
      siteConfig: {
        presets: [
          [
            path.join(__dirname, '__fixtures__/presets/preset-plugins.js'),
            {docs: {path: '../'}},
          ],
          false,
          null,
          undefined,
          path.join(__dirname, '__fixtures__/presets/preset-themes.js'),
          path.join(__dirname, '__fixtures__/presets/preset-mixed.js'),
        ],
      },
    } as LoadContext;
    const presets = await loadPresets(context);
    expect(presets).toMatchSnapshot();
  });
});
