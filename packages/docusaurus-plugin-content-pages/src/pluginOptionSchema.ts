/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import * as Joi from '@hapi/joi';
import {PluginOptions} from './types';

export const DEFAULT_OPTIONS: PluginOptions = {
  path: 'src/pages', // Path to data on filesystem, relative to site dir.
  routeBasePath: '', // URL Route.
  include: ['**/*.{js,jsx,ts,tsx,md,mdx}'], // Extensions to include.
  mdxPageComponent: '@theme/MDXPage',
  remarkPlugins: [],
  rehypePlugins: [],
  admonitions: {},
};

export const PluginOptionSchema = Joi.object({
  path: Joi.string().default(DEFAULT_OPTIONS.path),
  routeBasePath: Joi.string().default(DEFAULT_OPTIONS.routeBasePath),
  include: Joi.array().items(Joi.string()).default(DEFAULT_OPTIONS.include),
  mdxPageComponent: Joi.string().default(DEFAULT_OPTIONS.mdxPageComponent),
  remarkPlugins: Joi.array()
    .items(
      Joi.array()
        .items(Joi.function().required(), Joi.object().required())
        .length(2),
      Joi.function(),
    )
    .default(DEFAULT_OPTIONS.remarkPlugins),
  rehypePlugins: Joi.array()
    .items(
      Joi.array()
        .items(Joi.function().required(), Joi.object().required())
        .length(2),
      Joi.function(),
    )
    .default(DEFAULT_OPTIONS.rehypePlugins),
  admonitions: Joi.object().default(DEFAULT_OPTIONS.admonitions),
});
