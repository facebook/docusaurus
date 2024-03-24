/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {Joi, RouteBasePathSchema} from '@docusaurus/utils-validation';
import type {OptionValidationContext} from '@docusaurus/types';
import type {PluginOptions, Options} from '@docusaurus/plugin-showcase';

export const DEFAULT_OPTIONS: PluginOptions = {
  id: 'showcase',
  path: 'src/showcase/website', // Path to data on filesystem, relative to site dir.
  routeBasePath: '/', // URL Route.
};

const PluginOptionSchema = Joi.object<PluginOptions>({
  path: Joi.string().default(DEFAULT_OPTIONS.path),
  routeBasePath: RouteBasePathSchema.default(DEFAULT_OPTIONS.routeBasePath),
});

export const contentAuthorsSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  preview: Joi.string().required(),
  website: Joi.string().required(),
  source: Joi.string().required(),
  tags: Joi.array().items(Joi.string()).required(),
});

export function validateOptions({
  validate,
  options,
}: OptionValidationContext<Options, PluginOptions>): PluginOptions {
  const validatedOptions = validate(PluginOptionSchema, options);
  return validatedOptions;
}
