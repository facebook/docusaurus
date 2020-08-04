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
} from '@docusaurus/utils-validation';

export const DEFAULT_OPTIONS: PluginOptions = {
  path: 'src/pages', // Path to data on filesystem, relative to site dir.
  routeBasePath: '', // URL Route.
  include: ['**/*.{js,jsx,ts,tsx,md,mdx}'], // Extensions to include.
  mdxPageComponent: '@theme/MDXPage',
  remarkPlugins: [],
  rehypePlugins: [],
  admonitions: {},
  exclude: ['**/_*.{js,jsx,ts,tsx,md,mdx}', '**/*.test.{js,ts}', '**/__tests__/**'],
};

export const PluginOptionSchema = Joi.object({
  path: Joi.string().default(DEFAULT_OPTIONS.path),
  routeBasePath: Joi.string().default(DEFAULT_OPTIONS.routeBasePath),
  include: Joi.array().items(Joi.string()).default(DEFAULT_OPTIONS.include),
  exclude: Joi.array().items(Joi.string()).default(DEFAULT_OPTIONS.exclude),
  mdxPageComponent: Joi.string().default(DEFAULT_OPTIONS.mdxPageComponent),
  remarkPlugins: RemarkPluginsSchema.default(DEFAULT_OPTIONS.remarkPlugins),
  rehypePlugins: RehypePluginsSchema.default(DEFAULT_OPTIONS.rehypePlugins),
  admonitions: AdmonitionsSchema.default(DEFAULT_OPTIONS.admonitions),
});
