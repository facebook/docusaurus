/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {PluginOptionSchema, DEFAULT_OPTIONS} from '../pluginOptionSchema';

export default function normalizePluginOptions(options) {
  const {value, error} = PluginOptionSchema.validate(options, {
    convert: false,
  });
  if (error) {
    throw error;
  } else {
    return value;
  }
}

// remark and rehype plugins are of function type
const remarkRehypePluginStub = () => {};

describe('normalizeDocsPluginOptions', () => {
  test('should return default options for undefined user options', async () => {
    const {value} = await PluginOptionSchema.validate({});
    expect(value).toEqual(DEFAULT_OPTIONS);
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
      remarkPlugins: [],
      rehypePlugins: [remarkRehypePluginStub],
      showLastUpdateTime: true,
      showLastUpdateAuthor: true,
      admonitions: {},
      excludeNextVersionDocs: true,
      disableVersioning: true,
    };
    const {value} = await PluginOptionSchema.validate(userOptions);
    expect(value).toEqual(userOptions);
  });

  test('should accept correctly defined remark and rehype plugin options', async () => {
    const userOptions = {
      ...DEFAULT_OPTIONS,
      remarkPlugins: [remarkRehypePluginStub, {option1: '42'}],
      rehypePlugins: [
        remarkRehypePluginStub,
        [remarkRehypePluginStub, {option1: '42'}],
      ],
    };
    const {value} = await PluginOptionSchema.validate(userOptions);
    expect(value).toEqual(userOptions);
  });

  test('should reject bad path inputs', () => {
    expect(() => {
      normalizePluginOptions({
        path: 2,
      });
    }).toThrowErrorMatchingInlineSnapshot(`"\\"path\\" must be a string"`);
  });

  test('should reject bad include inputs', () => {
    expect(() => {
      normalizePluginOptions({
        include: '**/*.{md,mdx}',
      });
    }).toThrowErrorMatchingInlineSnapshot(`"\\"include\\" must be an array"`);
  });

  test('should reject bad showLastUpdateTime inputs', () => {
    expect(() => {
      normalizePluginOptions({
        showLastUpdateTime: 'true',
      });
    }).toThrowErrorMatchingInlineSnapshot(
      `"\\"showLastUpdateTime\\" must be a boolean"`,
    );
  });

  test('should reject bad remarkPlugins input', () => {
    expect(() => {
      normalizePluginOptions({
        remarkPlugins: 'remark-math',
      });
    }).toThrowErrorMatchingInlineSnapshot(
      `"\\"remarkPlugins\\" must be an array"`,
    );
  });
});
