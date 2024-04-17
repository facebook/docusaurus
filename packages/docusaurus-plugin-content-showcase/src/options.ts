/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {Joi, RouteBasePathSchema} from '@docusaurus/utils-validation';
import {GlobExcludeDefault} from '@docusaurus/utils';
import {tagSchema} from './tags';
import type {OptionValidationContext} from '@docusaurus/types';
import type {PluginOptions, Options} from '@docusaurus/plugin-content-showcase';

export const DEFAULT_OPTIONS: PluginOptions = {
  path: 'showcase', // Path to data on filesystem, relative to site dir.
  routeBasePath: '/showcase', // URL Route.
  include: ['**/*.{yml,yaml}'],
  // TODO exclude won't work if user pass a custom file name
  exclude: [...GlobExcludeDefault, 'tags.*'],
  screenshotApi: 'https://slorber-api-screenshot.netlify.app',
  tags: 'tags.yml',
};

const PluginOptionSchema = Joi.object<PluginOptions>({
  path: Joi.string().default(DEFAULT_OPTIONS.path),
  routeBasePath: RouteBasePathSchema.default(DEFAULT_OPTIONS.routeBasePath),
  include: Joi.array().items(Joi.string()).default(DEFAULT_OPTIONS.include),
  exclude: Joi.array().items(Joi.string()).default(DEFAULT_OPTIONS.exclude),
  tags: Joi.alternatives()
    .try(Joi.string().default(DEFAULT_OPTIONS.tags), tagSchema)
    .default(DEFAULT_OPTIONS.tags),
  screenshotApi: Joi.string().default(DEFAULT_OPTIONS.screenshotApi),
});

export function validateOptions({
  validate,
  options,
}: OptionValidationContext<Options, PluginOptions>): PluginOptions {
  const validatedOptions = validate(PluginOptionSchema, options);
  return validatedOptions;
}
