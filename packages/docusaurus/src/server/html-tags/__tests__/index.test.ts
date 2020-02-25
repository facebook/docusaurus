/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';

import {loadHtmlTags} from '../index';

const pluginEmpty = require('./__fixtures__/plugin-empty');
const pluginPreBodyTags = require('./__fixtures__/plugin-preBodyTags');
const pluginHeadTags = require('./__fixtures__/plugin-headTags');
const pluginPostBodyTags = require('./__fixtures__/plugin-postBodyTags');

describe('loadHtmlTags', () => {
  test('empty plugin', () => {
    const htmlTags = loadHtmlTags([pluginEmpty()]);
    expect(htmlTags).toMatchInlineSnapshot(`
      Object {
        "headTags": "",
        "postBodyTags": "",
        "preBodyTags": "",
      }
    `);
  });

  test('only inject headTags', () => {
    const htmlTags = loadHtmlTags([pluginHeadTags()]);
    expect(htmlTags).toMatchInlineSnapshot(`
      Object {
        "headTags": "<link rel=\\"preconnect\\" href=\\"www.google-analytics.com\\">
      <meta name=\\"generator\\" content=\\"docusaurus\\">",
        "postBodyTags": "",
        "preBodyTags": "",
      }
    `);
  });

  test('only inject preBodyTags', () => {
    const htmlTags = loadHtmlTags([pluginPreBodyTags()]);
    expect(htmlTags).toMatchInlineSnapshot(`
      Object {
        "headTags": "",
        "postBodyTags": "",
        "preBodyTags": "<script type=\\"text/javascript\\">window.foo = null;</script>",
      }
    `);
  });

  test('only inject postBodyTags', () => {
    const htmlTags = loadHtmlTags([pluginPostBodyTags()]);
    expect(htmlTags).toMatchInlineSnapshot(`
      Object {
        "headTags": "",
        "postBodyTags": "<div>Test content</div>",
        "preBodyTags": "",
      }
    `);
  });

  test('multiple plugins that inject different part of html tags', () => {
    const htmlTags = loadHtmlTags([
      pluginHeadTags(),
      pluginPostBodyTags(),
      pluginPreBodyTags(),
    ]);
    expect(htmlTags).toMatchInlineSnapshot(`
      Object {
        "headTags": "<link rel=\\"preconnect\\" href=\\"www.google-analytics.com\\">
      <meta name=\\"generator\\" content=\\"docusaurus\\">",
        "postBodyTags": "<div>Test content</div>",
        "preBodyTags": "<script type=\\"text/javascript\\">window.foo = null;</script>",
      }
    `);
  });

  test('multiple plugins that might/might not inject html tags', () => {
    const htmlTags = loadHtmlTags([
      pluginEmpty(),
      pluginHeadTags(),
      pluginPostBodyTags(),
    ]);
    expect(htmlTags).toMatchInlineSnapshot(`
      Object {
        "headTags": "<link rel=\\"preconnect\\" href=\\"www.google-analytics.com\\">
      <meta name=\\"generator\\" content=\\"docusaurus\\">",
        "postBodyTags": "<div>Test content</div>",
        "preBodyTags": "",
      }
    `);
  });
});
