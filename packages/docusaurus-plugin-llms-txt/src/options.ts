/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {Joi} from '@docusaurus/utils-validation';
import type {PluginOptions, Options} from '@docusaurus/plugin-llms-txt';

// Define the minimal types we need
type OptionValidationContext<UserOptions, _NormalizedOptions> = {
  validate: <T>(schema: unknown, options: T) => T;
  options: UserOptions;
};

export const DEFAULT_OPTIONS: PluginOptions = {
  filename: 'llms.txt',
  includeBlog: true,
  includeDocs: true,
  includePages: true,
  maxDepth: 3,
  excludeRoutes: [],
  includeFullContent: false,
};

const pluginOptionsSchema = Joi.object<PluginOptions>({
  filename: Joi.string().default(DEFAULT_OPTIONS.filename),
  siteTitle: Joi.string().optional(),
  siteDescription: Joi.string().optional(),
  includeBlog: Joi.boolean().default(DEFAULT_OPTIONS.includeBlog),
  includeDocs: Joi.boolean().default(DEFAULT_OPTIONS.includeDocs),
  includePages: Joi.boolean().default(DEFAULT_OPTIONS.includePages),
  maxDepth: Joi.number().integer().min(1).default(DEFAULT_OPTIONS.maxDepth),
  excludeRoutes: Joi.array()
    .items(Joi.string())
    .default(DEFAULT_OPTIONS.excludeRoutes),
  customContent: Joi.string().optional(),
  includeFullContent: Joi.boolean().default(DEFAULT_OPTIONS.includeFullContent),
});

export function validateOptions({
  validate,
  options,
}: OptionValidationContext<Options, PluginOptions>): PluginOptions {
  return validate(pluginOptionsSchema, options) as PluginOptions;
}
