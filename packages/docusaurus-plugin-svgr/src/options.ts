/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import {Joi} from '@docusaurus/utils-validation';
import type {OptionValidationContext} from '@docusaurus/types';

type SVGROptions = Record<string, unknown>;

export type PluginOptions = {
  svgrOptions: SVGROptions;
};

export type Options = {
  svgrOptions?: Partial<SVGROptions>;
};

export const DEFAULT_OPTIONS: Partial<PluginOptions> = {
  svgrOptions: {},
};

const pluginOptionsSchema = Joi.object<PluginOptions>({
  svgrOptions: Joi.object()
    .pattern(Joi.string(), Joi.any())
    .optional()
    .default(DEFAULT_OPTIONS.svgrOptions),
}).default(DEFAULT_OPTIONS);

export function validateOptions({
  validate,
  options,
}: OptionValidationContext<Options | undefined, PluginOptions>): PluginOptions {
  return validate(pluginOptionsSchema, options);
}
