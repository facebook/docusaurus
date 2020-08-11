/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {PluginOptionSchema, DEFAULT_OPTIONS} from '../pluginOptionSchema';
import {normalizePluginOptions} from '@docusaurus/utils-validation';

// the type of remark/rehype plugins is function
const markdownPluginsFunctionStub = () => {};
const markdownPluginsObjectStub = {};

describe('normalizeDocsPluginOptions', () => {
  test('should return default options for undefined user options', async () => {
    const {value, error} = await PluginOptionSchema.validate({});
    expect(value).toEqual(DEFAULT_OPTIONS);
    expect(error).toBe(undefined);
  });

  test('should accept correctly defined user options', async () => {
    const userOptions = {
      path: 'my-docs', // Path to data on filesystem, relative to site dir.
      routeBasePath: 'my-docs', // URL Route.
      homePageId: 'home', // Document id for docs home page.
      include: ['**/*.{md,mdx}'], // Extensions to include.
      sidebarPath: 'my-sidebar', // Path to sidebar configuration for showing a list of markdown pages.
      docLayoutComponent: '@theme/DocPage',
      docItemComponent: '@theme/DocItem',
      remarkPlugins: [markdownPluginsObjectStub],
      rehypePlugins: [markdownPluginsFunctionStub],
      showLastUpdateTime: true,
      showLastUpdateAuthor: true,
      admonitions: {},
      excludeNextVersionDocs: true,
      disableVersioning: true,
    };
    const {value, error} = await PluginOptionSchema.validate(userOptions);
    expect(value).toEqual(userOptions);
    expect(error).toBe(undefined);
  });

  test('should accept correctly defined remark and rehype plugin options', async () => {
    const userOptions = {
      ...DEFAULT_OPTIONS,
      remarkPlugins: [[markdownPluginsFunctionStub, {option1: '42'}]],
      rehypePlugins: [
        markdownPluginsObjectStub,
        [markdownPluginsFunctionStub, {option1: '42'}],
      ],
    };
    const {value, error} = await PluginOptionSchema.validate(userOptions);
    expect(value).toEqual(userOptions);
    expect(error).toBe(undefined);
  });

  test('should reject invalid remark plugin options', () => {
    expect(() => {
      normalizePluginOptions(PluginOptionSchema, {
        remarkPlugins: [[{option1: '42'}, markdownPluginsFunctionStub]],
      });
    }).toThrowErrorMatchingInlineSnapshot(
      `"\\"remarkPlugins[0]\\" does not match any of the allowed types"`,
    );
  });

  test('should reject invalid rehype plugin options', () => {
    expect(() => {
      normalizePluginOptions(PluginOptionSchema, {
        rehypePlugins: [
          [
            markdownPluginsFunctionStub,
            {option1: '42'},
            markdownPluginsFunctionStub,
          ],
        ],
      });
    }).toThrowErrorMatchingInlineSnapshot(
      `"\\"rehypePlugins[0]\\" does not match any of the allowed types"`,
    );
  });

  test('should reject bad path inputs', () => {
    expect(() => {
      normalizePluginOptions(PluginOptionSchema, {
        path: 2,
      });
    }).toThrowErrorMatchingInlineSnapshot(`"\\"path\\" must be a string"`);
  });

  test('should reject bad include inputs', () => {
    expect(() => {
      normalizePluginOptions(PluginOptionSchema, {
        include: '**/*.{md,mdx}',
      });
    }).toThrowErrorMatchingInlineSnapshot(`"\\"include\\" must be an array"`);
  });

  test('should reject bad showLastUpdateTime inputs', () => {
    expect(() => {
      normalizePluginOptions(PluginOptionSchema, {
        showLastUpdateTime: 'true',
      });
    }).toThrowErrorMatchingInlineSnapshot(
      `"\\"showLastUpdateTime\\" must be a boolean"`,
    );
  });

  test('should reject bad remarkPlugins input', () => {
    expect(() => {
      normalizePluginOptions(PluginOptionSchema, {
        remarkPlugins: 'remark-math',
      });
    }).toThrowErrorMatchingInlineSnapshot(
      `"\\"remarkPlugins\\" must be an array"`,
    );
  });
});
