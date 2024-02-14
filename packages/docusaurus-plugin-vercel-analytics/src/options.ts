/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import {DEFAULT_PLUGIN_ID} from '@docusaurus/utils';
import {Joi} from '@docusaurus/utils-validation';
import type {OptionValidationContext} from '@docusaurus/types';

export type PluginOptions = {
  id: string;
  mode: 'auto' | 'production' | 'development' | undefined;
  debug: boolean | undefined;
};

export type Options = Partial<PluginOptions>;

const pluginOptionsSchema = Joi.object<PluginOptions>({
  id: Joi.string().valid(DEFAULT_PLUGIN_ID).default(DEFAULT_PLUGIN_ID),
  mode: Joi.string().valid('auto', 'production', 'development').optional(),
  debug: Joi.boolean().optional(),
});

export function validateOptions({
  validate,
  options,
}: OptionValidationContext<Options, PluginOptions>): PluginOptions {
  return validate(pluginOptionsSchema, options);
}
