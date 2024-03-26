/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  Joi,
  validateFrontMatter,
  RouteBasePathSchema,
} from '@docusaurus/utils-validation';
import {GlobExcludeDefault} from '@docusaurus/utils';
import type {OptionValidationContext} from '@docusaurus/types';
import type {
  PluginOptions,
  Options,
  ShowcaseFrontMatter,
} from '@docusaurus/plugin-showcase';

export const DEFAULT_OPTIONS: PluginOptions = {
  id: 'showcase',
  path: 'src/showcase/website', // Path to data on filesystem, relative to site dir.
  routeBasePath: '/', // URL Route.
  include: ['**/*.{yml,yaml,md,mdx}'], // Extensions to include.
  exclude: GlobExcludeDefault,
};

const PluginOptionSchema = Joi.object<PluginOptions>({
  path: Joi.string().default(DEFAULT_OPTIONS.path),
  routeBasePath: RouteBasePathSchema.default(DEFAULT_OPTIONS.routeBasePath),
  include: Joi.array().items(Joi.string()).default(DEFAULT_OPTIONS.include),
  exclude: Joi.array().items(Joi.string()).default(DEFAULT_OPTIONS.exclude),
  id: Joi.string().default(DEFAULT_OPTIONS.id),
});

const contentAuthorsSchema = Joi.object({
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

export function validateShowcaseFrontMatter(frontMatter: {
  [key: string]: unknown;
}): ShowcaseFrontMatter {
  return validateFrontMatter(frontMatter, contentAuthorsSchema);
}
