/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import * as Joi from '@hapi/joi';
import {PluginOptions} from './types';

const REVERSED_DOCS_HOME_PAGE_ID = '_index';

export const DEFAULT_OPTIONS: PluginOptions = {
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
  excludeNextVersionDocs: false,
};

export const PluginOptionSchema = Joi.object({
  path: Joi.string().default(DEFAULT_OPTIONS.path),
  editUrl: Joi.string().uri(),
  routeBasePath: Joi.string().default(DEFAULT_OPTIONS.routeBasePath),
  homePageId: Joi.string().default(DEFAULT_OPTIONS.homePageId),
  include: Joi.array().items(Joi.string()).default(DEFAULT_OPTIONS.include),
  sidebarPath: Joi.string().default(DEFAULT_OPTIONS.sidebarPath),
  docLayoutComponent: Joi.string().default(DEFAULT_OPTIONS.docLayoutComponent),
  docItemComponent: Joi.string().default(DEFAULT_OPTIONS.docItemComponent),
  remarkPlugins: Joi.array()
    .items(
      Joi.array().items(Joi.function(), Joi.object()).length(2),
      Joi.function(),
    )
    .default(DEFAULT_OPTIONS.remarkPlugins),
  rehypePlugins: Joi.array()
    .items(Joi.string())
    .default(DEFAULT_OPTIONS.rehypePlugins),
  showLastUpdateTime: Joi.bool().default(DEFAULT_OPTIONS.showLastUpdateTime),
  showLastUpdateAuthor: Joi.bool().default(
    DEFAULT_OPTIONS.showLastUpdateAuthor,
  ),
  admonitions: Joi.object().default(DEFAULT_OPTIONS.admonitions),
  excludeNextVersionDocs: Joi.bool().default(
    DEFAULT_OPTIONS.excludeNextVersionDocs,
  ),
});
