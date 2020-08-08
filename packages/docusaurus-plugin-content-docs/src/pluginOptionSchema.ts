/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import * as Joi from '@hapi/joi';
import {PluginOptions} from './types';
import {
  RemarkPluginsSchema,
  RehypePluginsSchema,
  AdmonitionsSchema,
  URISchema,
} from '@docusaurus/utils-validation';

export const DEFAULT_OPTIONS: PluginOptions = {
  path: 'docs', // Path to data on filesystem, relative to site dir.
  routeBasePath: 'docs', // URL Route.
  homePageId: undefined, // TODO remove soon, deprecated
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
  disableVersioning: false,
};

export const PluginOptionSchema = Joi.object({
  path: Joi.string().default(DEFAULT_OPTIONS.path),
  editUrl: URISchema,
  routeBasePath: Joi.string().allow('').default(DEFAULT_OPTIONS.routeBasePath),
  homePageId: Joi.string().optional(),
  include: Joi.array().items(Joi.string()).default(DEFAULT_OPTIONS.include),
  sidebarPath: Joi.string().default(DEFAULT_OPTIONS.sidebarPath),
  docLayoutComponent: Joi.string().default(DEFAULT_OPTIONS.docLayoutComponent),
  docItemComponent: Joi.string().default(DEFAULT_OPTIONS.docItemComponent),
  remarkPlugins: RemarkPluginsSchema.default(DEFAULT_OPTIONS.remarkPlugins),
  rehypePlugins: RehypePluginsSchema.default(DEFAULT_OPTIONS.rehypePlugins),
  admonitions: AdmonitionsSchema.default(DEFAULT_OPTIONS.admonitions),
  showLastUpdateTime: Joi.bool().default(DEFAULT_OPTIONS.showLastUpdateTime),
  showLastUpdateAuthor: Joi.bool().default(
    DEFAULT_OPTIONS.showLastUpdateAuthor,
  ),
  excludeNextVersionDocs: Joi.bool().default(
    DEFAULT_OPTIONS.excludeNextVersionDocs,
  ),
  disableVersioning: Joi.bool().default(DEFAULT_OPTIONS.disableVersioning),
});
