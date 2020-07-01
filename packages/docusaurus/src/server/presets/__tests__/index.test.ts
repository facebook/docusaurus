/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';

import loadPresets from '../index';
import {LoadContext} from '@docusaurus/types';

describe('loadPresets', () => {
  test('no presets', () => {
    const context = {siteConfig: {}} as LoadContext;
    const presets = loadPresets(context);
    expect(presets).toMatchInlineSnapshot(`
      Object {
        "plugins": Array [],
        "themes": Array [],
      }
    `);
  });

  test('string form', () => {
    const context = {
      siteConfig: {
        presets: [path.join(__dirname, '__fixtures__/preset-bar.js')],
      },
    } as LoadContext;
    const presets = loadPresets(context);
    expect(presets).toMatchInlineSnapshot(`
      Object {
        "plugins": Array [
          Array [
            "@docusaurus/plugin-content-docs",
            undefined,
          ],
          Array [
            "@docusaurus/plugin-content-blog",
            undefined,
          ],
        ],
        "themes": Array [],
      }
    `);
  });

  test('string form composite', () => {
    const context = {
      siteConfig: {
        presets: [
          path.join(__dirname, '__fixtures__/preset-bar.js'),
          path.join(__dirname, '__fixtures__/preset-foo.js'),
        ],
      },
    } as LoadContext;
    const presets = loadPresets(context);
    expect(presets).toMatchInlineSnapshot(`
      Object {
        "plugins": Array [
          Array [
            "@docusaurus/plugin-content-docs",
            undefined,
          ],
          Array [
            "@docusaurus/plugin-content-blog",
            undefined,
          ],
          Array [
            "@docusaurus/plugin-content-pages",
            undefined,
          ],
          Array [
            "@docusaurus/plugin-sitemap",
            undefined,
          ],
        ],
        "themes": Array [],
      }
    `);
  });

  test('array form', () => {
    const context = {
      siteConfig: {
        presets: [[path.join(__dirname, '__fixtures__/preset-bar.js')]],
      },
    } as Partial<LoadContext>;
    const presets = loadPresets(context);
    expect(presets).toMatchInlineSnapshot(`
      Object {
        "plugins": Array [
          Array [
            "@docusaurus/plugin-content-docs",
            undefined,
          ],
          Array [
            "@docusaurus/plugin-content-blog",
            undefined,
          ],
        ],
        "themes": Array [],
      }
    `);
  });

  test('array form with options', () => {
    const context = {
      siteConfig: {
        presets: [
          [
            path.join(__dirname, '__fixtures__/preset-bar.js'),
            {docs: {path: '../'}},
          ],
        ],
      },
    } as Partial<LoadContext>;
    const presets = loadPresets(context);
    expect(presets).toMatchInlineSnapshot(`
      Object {
        "plugins": Array [
          Array [
            "@docusaurus/plugin-content-docs",
            Object {
              "path": "../",
            },
          ],
          Array [
            "@docusaurus/plugin-content-blog",
            undefined,
          ],
        ],
        "themes": Array [],
      }
    `);
  });

  test('array form composite', () => {
    const context = {
      siteConfig: {
        presets: [
          [
            path.join(__dirname, '__fixtures__/preset-bar.js'),
            {docs: {path: '../'}},
          ],
          [
            path.join(__dirname, '__fixtures__/preset-foo.js'),
            {pages: {path: '../'}},
          ],
        ],
      },
    } as Partial<LoadContext>;
    const presets = loadPresets(context);
    expect(presets).toMatchInlineSnapshot(`
      Object {
        "plugins": Array [
          Array [
            "@docusaurus/plugin-content-docs",
            Object {
              "path": "../",
            },
          ],
          Array [
            "@docusaurus/plugin-content-blog",
            undefined,
          ],
          Array [
            "@docusaurus/plugin-content-pages",
            Object {
              "path": "../",
            },
          ],
          Array [
            "@docusaurus/plugin-sitemap",
            undefined,
          ],
        ],
        "themes": Array [],
      }
    `);
  });

  test('mixed form', () => {
    const context = {
      siteConfig: {
        presets: [
          [
            path.join(__dirname, '__fixtures__/preset-bar.js'),
            {docs: {path: '../'}},
          ],
          path.join(__dirname, '__fixtures__/preset-foo.js'),
        ],
      },
    } as LoadContext;
    const presets = loadPresets(context);
    expect(presets).toMatchInlineSnapshot(`
      Object {
        "plugins": Array [
          Array [
            "@docusaurus/plugin-content-docs",
            Object {
              "path": "../",
            },
          ],
          Array [
            "@docusaurus/plugin-content-blog",
            undefined,
          ],
          Array [
            "@docusaurus/plugin-content-pages",
            undefined,
          ],
          Array [
            "@docusaurus/plugin-sitemap",
            undefined,
          ],
        ],
        "themes": Array [],
      }
    `);
  });

  test('mixed form with themes', () => {
    const context = {
      siteConfig: {
        presets: [
          [
            path.join(__dirname, '__fixtures__/preset-bar.js'),
            {docs: {path: '../'}},
          ],
          path.join(__dirname, '__fixtures__/preset-foo.js'),
          path.join(__dirname, '__fixtures__/preset-qux.js'),
        ],
      },
    } as LoadContext;
    const presets = loadPresets(context);
    expect(presets).toMatchInlineSnapshot(`
      Object {
        "plugins": Array [
          Array [
            "@docusaurus/plugin-content-docs",
            Object {
              "path": "../",
            },
          ],
          Array [
            "@docusaurus/plugin-content-blog",
            undefined,
          ],
          Array [
            "@docusaurus/plugin-content-pages",
            undefined,
          ],
          Array [
            "@docusaurus/plugin-sitemap",
            undefined,
          ],
          Array [
            "@docusaurus/plugin-test",
            undefined,
          ],
        ],
        "themes": Array [
          Array [
            "@docusaurus/theme-classic",
            undefined,
          ],
        ],
      }
    `);
  });
});
