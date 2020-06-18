/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import * as yup from 'yup';

// A yup string without type coercion
class StrictString extends yup.string {
  constructor() {
    super();
    // @ts-ignore
    this.transforms = []; // remove coercion, see https://github.com/jquense/yup/issues/934
  }
}

// A yup bool without type coercion
class StrictBool extends yup.bool {
  constructor() {
    super();
    // @ts-ignore
    this.transforms = [];
  }
}

export const REVERSED_DOCS_HOME_PAGE_ID = '_index';

export const PluginOptionSchema = yup
  .object()
  .shape({
    path: new StrictString().default('docs'), // Path to data on filesystem, relative to site dir.
    routeBasePath: new StrictString().default('docs'), // URL Route.
    homePageId: new StrictString().default(REVERSED_DOCS_HOME_PAGE_ID), // Document id for docs home page.
    include: yup.array().of(new StrictString()).default(['**/*.{md,mdx}']), // Extensions to include
    sidebarPath: new StrictString().default(''), // Path to sidebar configuration for showing a list of markdown pages.
    docLayoutComponent: new StrictString().default('@theme/DocPage'),
    docItemComponent: new StrictString().default('@theme/DocItem'),
    remarkPlugins: yup.array(yup.object()).default([]),
    rehypePlugins: yup.array(yup.object()).default([]),
    showLastUpdateTime: new StrictBool().default(false),
    showLastUpdateAuthor: new StrictBool().default(false),
    admonitions: yup.object().default({}),
  })
  .defined();
