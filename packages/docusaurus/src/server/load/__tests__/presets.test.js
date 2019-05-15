/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';

import loadPresets from '../presets';

describe('loadPresets', () => {
  test('no presets', () => {
    const presets = loadPresets({siteConfig: {presets: []}});
    expect(presets).toMatchInlineSnapshot(`
Object {
  "plugins": Array [],
  "themes": Array [],
}
`);
  });

  test('string form', () => {
    const presets = loadPresets({
      siteConfig: {
        presets: [path.join(__dirname, '__fixtures__/preset-bar.js')],
      },
    });
    expect(presets).toMatchInlineSnapshot(`
Object {
  "plugins": Array [
    Object {
      "name": "@docusaurus/plugin-content-docs",
      "options": undefined,
    },
    Object {
      "name": "@docusaurus/plugin-content-blog",
      "options": undefined,
    },
  ],
  "themes": Array [],
}
`);
  });

  test('string form composite', () => {
    const presets = loadPresets({
      siteConfig: {
        presets: [
          path.join(__dirname, '__fixtures__/preset-bar.js'),
          path.join(__dirname, '__fixtures__/preset-foo.js'),
        ],
      },
    });
    expect(presets).toMatchInlineSnapshot(`
Object {
  "plugins": Array [
    Object {
      "name": "@docusaurus/plugin-content-docs",
      "options": undefined,
    },
    Object {
      "name": "@docusaurus/plugin-content-blog",
      "options": undefined,
    },
    Object {
      "name": "@docusaurus/plugin-content-pages",
      "options": undefined,
    },
    Object {
      "name": "@docusaurus/plugin-sitemap",
      "options": undefined,
    },
  ],
  "themes": Array [],
}
`);
  });

  test('array form', () => {
    const presets = loadPresets({
      siteConfig: {
        presets: [[path.join(__dirname, '__fixtures__/preset-bar.js')]],
      },
    });
    expect(presets).toMatchInlineSnapshot(`
Object {
  "plugins": Array [
    Object {
      "name": "@docusaurus/plugin-content-docs",
      "options": undefined,
    },
    Object {
      "name": "@docusaurus/plugin-content-blog",
      "options": undefined,
    },
  ],
  "themes": Array [],
}
`);
  });

  test('array form with options', () => {
    const presets = loadPresets({
      siteConfig: {
        presets: [
          [
            path.join(__dirname, '__fixtures__/preset-bar.js'),
            {docs: {path: '../'}},
          ],
        ],
      },
    });
    expect(presets).toMatchInlineSnapshot(`
Object {
  "plugins": Array [
    Object {
      "name": "@docusaurus/plugin-content-docs",
      "options": Object {
        "path": "../",
      },
    },
    Object {
      "name": "@docusaurus/plugin-content-blog",
      "options": undefined,
    },
  ],
  "themes": Array [],
}
`);
  });

  test('array form composite', () => {
    const presets = loadPresets({
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
    });
    expect(presets).toMatchInlineSnapshot(`
Object {
  "plugins": Array [
    Object {
      "name": "@docusaurus/plugin-content-docs",
      "options": Object {
        "path": "../",
      },
    },
    Object {
      "name": "@docusaurus/plugin-content-blog",
      "options": undefined,
    },
    Object {
      "name": "@docusaurus/plugin-content-pages",
      "options": Object {
        "path": "../",
      },
    },
    Object {
      "name": "@docusaurus/plugin-sitemap",
      "options": undefined,
    },
  ],
  "themes": Array [],
}
`);
  });

  test('mixed form', () => {
    const presets = loadPresets({
      siteConfig: {
        presets: [
          [
            path.join(__dirname, '__fixtures__/preset-bar.js'),
            {docs: {path: '../'}},
          ],
          path.join(__dirname, '__fixtures__/preset-foo.js'),
        ],
      },
    });
    expect(presets).toMatchInlineSnapshot(`
Object {
  "plugins": Array [
    Object {
      "name": "@docusaurus/plugin-content-docs",
      "options": Object {
        "path": "../",
      },
    },
    Object {
      "name": "@docusaurus/plugin-content-blog",
      "options": undefined,
    },
    Object {
      "name": "@docusaurus/plugin-content-pages",
      "options": undefined,
    },
    Object {
      "name": "@docusaurus/plugin-sitemap",
      "options": undefined,
    },
  ],
  "themes": Array [],
}
`);
  });

  test('mixed form with themes', () => {
    const presets = loadPresets({
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
    });
    expect(presets).toMatchInlineSnapshot(`
Object {
  "plugins": Array [
    Object {
      "name": "@docusaurus/plugin-content-docs",
      "options": Object {
        "path": "../",
      },
    },
    Object {
      "name": "@docusaurus/plugin-content-blog",
      "options": undefined,
    },
    Object {
      "name": "@docusaurus/plugin-content-pages",
      "options": undefined,
    },
    Object {
      "name": "@docusaurus/plugin-sitemap",
      "options": undefined,
    },
    Object {
      "name": "@docusaurus/plugin-test",
      "options": undefined,
    },
  ],
  "themes": Array [
    Object {
      "name": "@docusaurus/theme-classic",
      "options": undefined,
    },
  ],
}
`);
  });
});
