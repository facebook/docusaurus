/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  PluginOptionSchema,
  REVERSED_DOCS_HOME_PAGE_ID,
} from '../pluginOptionSchema';
import {PluginOptions} from '../types';

const DEFAULT_OPTIONS: PluginOptions = {
  path: 'docs', // Path to data on filesystem, relative to site dir.
  routeBasePath: 'docs', // URL Route.
  homePageId: REVERSED_DOCS_HOME_PAGE_ID, // Document id for docs home page.
  include: ['**/*.{md,mdx}'], // Extensions to include.
  sidebarPath: '', // Path to sidebar configuration for showing a list of markdown pages.
  docLayoutComponent: '@theme/DocPage',
  docItemComponent: '@theme/DocItem',
  remarkPlugins: [],
  rehypePlugins: [],
  showLastUpdateTime: false,
  showLastUpdateAuthor: false,
  admonitions: {},
};

describe('normalizePluginOptions', () => {
  test('should return default options for undefined user options', async () => {
    let options = await PluginOptionSchema.validate({});
    expect(options).toEqual(DEFAULT_OPTIONS);
  });

  test('should fill in default options for partially defined user options', async () => {
    let options = await PluginOptionSchema.validate({routeBasePath: 'docs'});
    expect(options).toEqual(DEFAULT_OPTIONS);
  });

  test('should reject bad path inputs', () => {
    expect(() => {
      PluginOptionSchema.validateSync({
        path: 2,
      });
    }).toThrow();
  });

  test('should reject bad homePageId inputs', () => {
    expect(() => {
      PluginOptionSchema.validateSync({
        homePageId: 2,
      });
    }).toThrow();
  });

  test('should reject bad include inputs', () => {
    expect(() => {
      PluginOptionSchema.validateSync({
        include: '**/*.{md,mdx}',
      });
    }).toThrow();
  });

  test('should reject bad include inputs', () => {
    expect(() => {
      PluginOptionSchema.validateSync({
        showLastUpdateTime: 'true',
      });
    }).toThrow();
  });
});
