/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import {Joi} from '@docusaurus/utils-validation';
import type {OptionValidationContext} from '@docusaurus/types';

export type PluginOptions = {
  id: string;
  mode: 'auto' | 'production' | 'development' | undefined;
  debug: boolean | undefined;
};

export type Options = Partial<PluginOptions>;

const pluginOptionsSchema = Joi.object<PluginOptions>({
  id: Joi.string().valid('default').default('default'),
  mode: Joi.string().valid('auto', 'production', 'development').optional(),
  debug: Joi.boolean().optional(),
});

export function validateOptions({
  validate,
  options,
}: OptionValidationContext<Options, PluginOptions>): PluginOptions {
  return validate(pluginOptionsSchema, options);
}
