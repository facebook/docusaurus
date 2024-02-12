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
  mode: 'auto' | 'production' | 'development';
  debug: boolean | undefined;
};

export type Options = Partial<PluginOptions>;

export const DEFAULT_OPTIONS: Partial<PluginOptions> = {
  mode: 'auto',
  debug: undefined,
};

const pluginOptionsSchema = Joi.object<PluginOptions>({
  mode: Joi.string()
    .valid('auto', 'production', 'development')
    .default(DEFAULT_OPTIONS.mode),
  debug: Joi.boolean().default(DEFAULT_OPTIONS.debug),
});

export function validateOptions({
  validate,
  options,
}: OptionValidationContext<Options, PluginOptions>): PluginOptions {
  return validate(pluginOptionsSchema, options);
}
