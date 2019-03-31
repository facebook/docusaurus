/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import {loadConfig} from '@lib/load/config';
import loadSetup from '../loadSetup';

describe('loadConfig', () => {
  test('website with valid siteConfig', async () => {
    const {siteDir} = await loadSetup('simple');
    const config = loadConfig(siteDir);
    expect(config).toMatchInlineSnapshot(`
Object {
  "baseUrl": "/",
  "favicon": "img/docusaurus.ico",
  "headerIcon": "img/docusaurus.svg",
  "headerLinks": Array [
    Object {
      "doc": "foo/bar",
      "label": "Docs",
    },
    Object {
      "label": "Hello",
      "page": "hello/world",
    },
    Object {
      "languages": true,
    },
  ],
  "organizationName": "endiliey",
  "plugins": Array [
    Object {
      "name": "@docusaurus/plugin-content-docs",
      "options": Object {
        "path": "../docs",
        "sidebar": Object {
          "docs": Object {
            "Guides": Array [
              "hello",
            ],
            "Test": Array [
              "foo/bar",
              "foo/baz",
            ],
          },
        },
      },
    },
    Object {
      "name": "@docusaurus/plugin-content-pages",
    },
  ],
  "projectName": "hello",
  "tagline": "Hello World",
  "title": "Hello",
  "url": "https://docusaurus.io",
}
`);
    expect(config).not.toEqual({});
  });

  test('website with incomplete siteConfig', () => {
    const siteDir = path.join(__dirname, '__fixtures__', 'bad-site');
    expect(() => {
      loadConfig(siteDir);
    }).toThrowErrorMatchingInlineSnapshot(
      `"The required field(s) 'favicon', 'headerLinks', 'headerIcon', 'organizationName', 'projectName', 'tagline', 'url' are missing from docusaurus.config.js"`,
    );
  });

  test('website with useless field (wrong field) in siteConfig', () => {
    const siteDir = path.join(__dirname, '__fixtures__', 'wrong-site');
    expect(() => {
      loadConfig(siteDir);
    }).toThrowErrorMatchingInlineSnapshot(
      `"The required field(s) 'favicon', 'headerLinks', 'headerIcon' are missing from docusaurus.config.js"`,
    );
  });

  test('website with no siteConfig', () => {
    const siteDir = path.join(__dirname, '__fixtures__', 'nonExisting');
    expect(() => {
      loadConfig(siteDir);
    }).toThrowErrorMatchingInlineSnapshot(
      `"The required field(s) 'baseUrl', 'favicon', 'headerLinks', 'headerIcon', 'organizationName', 'projectName', 'tagline', 'title', 'url' are missing from docusaurus.config.js"`,
    );
  });
});
