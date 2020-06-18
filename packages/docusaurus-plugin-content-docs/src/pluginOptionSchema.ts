/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as yup from 'yup';

export const REVERSED_DOCS_HOME_PAGE_ID = '_index';

export const PluginOptionSchema = yup
  .object()
  .shape({
    path: yup.string().default('docs'), // Path to data on filesystem, relative to site dir.
    routeBasePath: yup.string().default('docs'), // URL Route.
    homePageId: yup.string().default(REVERSED_DOCS_HOME_PAGE_ID), // Document id for docs home page.
    include: yup.array().of(yup.string()).default(['**/*.{md,mdx}']), // Extensions to include
    sidebarPath: yup.string().default(''), // Path to sidebar configuration for showing a list of markdown pages.
    docLayoutComponent: yup.string().default('@theme/DocPage'),
    docItemComponent: yup.string().default('@theme/DocItem'),
    remarkPlugins: yup.array(yup.object()).default([]),
    rehypePlugins: yup.array(yup.object()).default([]),
    showLastUpdateTime: yup.bool().default(false),
    showLastUpdateAuthor: yup.bool().default(false),
    admonitions: yup.object().default({}),
  })
  .defined();
