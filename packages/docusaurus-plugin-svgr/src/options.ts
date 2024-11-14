/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import {Joi} from '@docusaurus/utils-validation';
import type {OptionValidationContext} from '@docusaurus/types';
import type {Config as SVGRConfig} from '@svgr/core';

export type PluginOptions = {
  svgrConfig: SVGRConfig;
};

export type Options = {
  svgrConfig?: Partial<SVGRConfig>;
};

export const DEFAULT_OPTIONS: Partial<PluginOptions> = {
  svgrConfig: {},
};

const pluginOptionsSchema = Joi.object<PluginOptions>({
  svgrConfig: Joi.object()
    .pattern(Joi.string(), Joi.any())
    .optional()
    .default(DEFAULT_OPTIONS.svgrConfig),
}).default(DEFAULT_OPTIONS);

export function validateOptions({
  validate,
  options,
}: OptionValidationContext<Options | undefined, PluginOptions>): PluginOptions {
  return validate(pluginOptionsSchema, options);
}
