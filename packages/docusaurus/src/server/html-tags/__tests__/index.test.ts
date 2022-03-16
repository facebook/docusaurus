/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {loadHtmlTags} from '../index';

import pluginEmpty from './__fixtures__/plugin-empty';
import pluginPreBodyTags from './__fixtures__/plugin-preBodyTags';
import pluginHeadTags from './__fixtures__/plugin-headTags';
import pluginPostBodyTags from './__fixtures__/plugin-postBodyTags';

describe('loadHtmlTags', () => {
  it('empty plugin', () => {
    const htmlTags = loadHtmlTags([pluginEmpty()]);
    expect(htmlTags).toMatchInlineSnapshot(`
      {
        "headTags": "",
        "postBodyTags": "",
        "preBodyTags": "",
      }
    `);
  });

  it('only inject headTags', () => {
    const htmlTags = loadHtmlTags([pluginHeadTags()]);
    expect(htmlTags).toMatchInlineSnapshot(`
      {
        "headTags": "<link rel=\\"preconnect\\" href=\\"www.google-analytics.com\\">
      <meta name=\\"generator\\" content=\\"docusaurus\\">",
        "postBodyTags": "",
        "preBodyTags": "",
      }
    `);
  });

  it('only inject preBodyTags', () => {
    const htmlTags = loadHtmlTags([pluginPreBodyTags()]);
    expect(htmlTags).toMatchInlineSnapshot(`
      {
        "headTags": "",
        "postBodyTags": "",
        "preBodyTags": "<script type=\\"text/javascript\\">window.foo = null;</script>",
      }
    `);
  });

  it('only inject postBodyTags', () => {
    const htmlTags = loadHtmlTags([pluginPostBodyTags()]);
    expect(htmlTags).toMatchInlineSnapshot(`
      {
        "headTags": "",
        "postBodyTags": "<div>Test content</div>",
        "preBodyTags": "",
      }
    `);
  });

  it('multiple plugins that inject different part of html tags', () => {
    const htmlTags = loadHtmlTags([
      pluginHeadTags(),
      pluginPostBodyTags(),
      pluginPreBodyTags(),
    ]);
    expect(htmlTags).toMatchInlineSnapshot(`
      {
        "headTags": "<link rel=\\"preconnect\\" href=\\"www.google-analytics.com\\">
      <meta name=\\"generator\\" content=\\"docusaurus\\">",
        "postBodyTags": "<div>Test content</div>",
        "preBodyTags": "<script type=\\"text/javascript\\">window.foo = null;</script>",
      }
    `);
  });

  it('multiple plugins that might/might not inject html tags', () => {
    const htmlTags = loadHtmlTags([
      pluginEmpty(),
      pluginHeadTags(),
      pluginPostBodyTags(),
    ]);
    expect(htmlTags).toMatchInlineSnapshot(`
      {
        "headTags": "<link rel=\\"preconnect\\" href=\\"www.google-analytics.com\\">
      <meta name=\\"generator\\" content=\\"docusaurus\\">",
        "postBodyTags": "<div>Test content</div>",
        "preBodyTags": "",
      }
    `);
  });
});
