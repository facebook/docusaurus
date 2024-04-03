/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {Joi, RouteBasePathSchema} from '@docusaurus/utils-validation';
import {GlobExcludeDefault} from '@docusaurus/utils';
import type {OptionValidationContext} from '@docusaurus/types';
import type {PluginOptions, Options} from '@docusaurus/plugin-content-showcase';

export const DEFAULT_OPTIONS: PluginOptions = {
  id: 'showcase',
  path: 'showcase', // Path to data on filesystem, relative to site dir.
  routeBasePath: '/', // URL Route.
  include: ['**/*.{yml,yaml}'],
  exclude: [...GlobExcludeDefault, 'tags.*'],
  tags: 'tags.yaml',
};

export const tagSchema = Joi.object().pattern(
  Joi.string(),
  Joi.object({
    label: Joi.string().required(),
    description: Joi.object({
      message: Joi.string().required(),
      id: Joi.string().required(),
    }).required(),
    color: Joi.string().required(),
  }),
);

const PluginOptionSchema = Joi.object<PluginOptions>({
  path: Joi.string().default(DEFAULT_OPTIONS.path),
  routeBasePath: RouteBasePathSchema.default(DEFAULT_OPTIONS.routeBasePath),
  include: Joi.array().items(Joi.string()).default(DEFAULT_OPTIONS.include),
  exclude: Joi.array().items(Joi.string()).default(DEFAULT_OPTIONS.exclude),
  id: Joi.string().default(DEFAULT_OPTIONS.id),
  tags: Joi.alternatives()
    .try(Joi.string().default(DEFAULT_OPTIONS.tags), tagSchema)
    .default(DEFAULT_OPTIONS.tags),
});

export function validateOptions({
  validate,
  options,
}: OptionValidationContext<Options, PluginOptions>): PluginOptions {
  const validatedOptions = validate(PluginOptionSchema, options);
  return validatedOptions;
}
