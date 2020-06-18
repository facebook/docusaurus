/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {PluginOptionSchema, REVERSED_DOCS_HOME_PAGE_ID} from '../validation';

test('normalize plugin-content-docs options', async () => {
  let options = await PluginOptionSchema.validate({});
  expect(options).toEqual({
    path: 'docs',
    routeBasePath: 'docs',
    homePageId: REVERSED_DOCS_HOME_PAGE_ID,
    include: ['**/*.{md,mdx}'],
    sidebarPath: '',
    docLayoutComponent: '@theme/DocPage',
    docItemComponent: '@theme/DocItem',
    remarkPlugins: [],
    rehypePlugins: [],
    showLastUpdateTime: false,
    showLastUpdateAuthor: false,
    admonitions: {},
  });
});
