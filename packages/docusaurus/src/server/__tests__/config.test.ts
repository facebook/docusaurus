/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import {loadConfig} from '../config';

describe('loadConfig', () => {
  test('website with valid siteConfig', async () => {
    const fixtures = path.join(__dirname, '__fixtures__');
    const siteDir = path.join(fixtures, 'simple-site');
    const config = loadConfig(siteDir);
    expect(config).toMatchInlineSnapshot(
      {
        plugins: expect.any(Array),
      },
      `
      Object {
        "baseUrl": "/",
        "customFields": Object {},
        "favicon": "img/docusaurus.ico",
        "organizationName": "endiliey",
        "plugins": Any<Array>,
        "projectName": "hello",
        "tagline": "Hello World",
        "themeConfig": Object {},
        "themes": Array [],
        "title": "Hello",
        "url": "https://docusaurus.io",
      }
    `,
    );
    expect(config).not.toEqual({});
  });

  test('website with incomplete siteConfig', () => {
    const siteDir = path.join(__dirname, '__fixtures__', 'bad-site');
    expect(() => {
      loadConfig(siteDir);
    }).toThrowErrorMatchingInlineSnapshot(
      `"The required field(s) 'favicon', 'url' are missing from docusaurus.config.js"`,
    );
  });

  test('website with useless field (wrong field) in siteConfig', () => {
    const siteDir = path.join(__dirname, '__fixtures__', 'wrong-site');
    expect(() => {
      loadConfig(siteDir);
    }).toThrowErrorMatchingInlineSnapshot(
      `"The required field(s) 'favicon' are missing from docusaurus.config.js"`,
    );
  });

  test('website with no siteConfig', () => {
    const siteDir = path.join(__dirname, '__fixtures__', 'nonExisting');
    expect(() => {
      loadConfig(siteDir);
    }).toThrowErrorMatchingInlineSnapshot(`"docusaurus.config.js not found"`);
  });
});
