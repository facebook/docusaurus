/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';

import {loadHtmlTags} from '../index';

const pluginEmpty = require('./__fixtures__/plugin-empty');
const pluginBodyTags = require('./__fixtures__/plugin-bodyTags-only');
const pluginHeadTags = require('./__fixtures__/plugin-headTags-only');
const pluginBothTags = require('./__fixtures__/plugin-both-tags');

describe('loadHtmlTags', () => {
  test('empty plugin', () => {
    const htmlTags = loadHtmlTags([pluginEmpty()]);
    expect(htmlTags).toMatchInlineSnapshot(`
      Object {
        "bodyTags": "",
        "headTags": "",
      }
    `);
  });

  test('only inject headTags', () => {
    const htmlTags = loadHtmlTags([pluginHeadTags()]);
    expect(htmlTags).toMatchInlineSnapshot(`
      Object {
        "bodyTags": "",
        "headTags": "<link rel=\\"preconnect\\" href=\\"www.google-analytics.com\\">",
      }
    `);
  });

  test('only inject bodyTags', () => {
    const htmlTags = loadHtmlTags([pluginBodyTags()]);
    expect(htmlTags).toMatchInlineSnapshot(`
      Object {
        "bodyTags": "<script type=\\"text/javascript\\">window.foo = null;</script>",
        "headTags": "",
      }
    `);
  });

  test('inject both headTags & bodyTags', () => {
    const htmlTags = loadHtmlTags([pluginBothTags()]);
    expect(htmlTags).toMatchInlineSnapshot(`
      Object {
        "bodyTags": "<div>Test content</div>",
        "headTags": "<link rel=\\"preconnect\\" href=\\"www.google-analytics.com\\">",
      }
    `);
  });

  test('multiple plugins that might/might not inject html tags', () => {
    const htmlTags = loadHtmlTags([
      pluginEmpty(),
      pluginHeadTags(),
      pluginBothTags(),
    ]);
    expect(htmlTags).toMatchInlineSnapshot(`
      Object {
        "bodyTags": "<div>Test content</div>",
        "headTags": "<link rel=\\"preconnect\\" href=\\"www.google-analytics.com\\">
      <link rel=\\"preconnect\\" href=\\"www.google-analytics.com\\">",
      }
    `);
  });
});
