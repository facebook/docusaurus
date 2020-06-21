/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import * as Joi from '@hapi/joi';
export const REVERSED_DOCS_HOME_PAGE_ID = '_index';

export const PluginOptionSchema = Joi.object({
  path: Joi.string().default('docs'), // Path to data on filesystem, relative to site dir.
  editUrl: Joi.string().uri(), // website URL for user to propose edits
  routeBasePath: Joi.string().default('docs'), // URL Route.
  homePageId: Joi.string().default(REVERSED_DOCS_HOME_PAGE_ID), // Document id for docs home page.
  include: Joi.array().items(Joi.string()).default(['**/*.{md,mdx}']), // Extensions to include
  sidebarPath: Joi.string().default(''), // Path to sidebar configuration for showing a list of markdown pages.
  docLayoutComponent: Joi.string().default('@theme/DocPage'),
  docItemComponent: Joi.string().default('@theme/DocItem'),
  remarkPlugins: Joi.array().default([]),
  rehypePlugins: Joi.array().default([]),
  showLastUpdateTime: Joi.bool().default(false),
  showLastUpdateAuthor: Joi.bool().default(false),
  admonitions: Joi.object().default({}),
});
