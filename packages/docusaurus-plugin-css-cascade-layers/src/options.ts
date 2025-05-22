/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import {Joi} from '@docusaurus/utils-validation';
import type {OptionValidationContext} from '@docusaurus/types';

export type PluginOptions = {
  layers: Record<string, (filePath: string) => boolean>;
};

export type Options = {
  layers: Record<string, (filePath: string) => boolean>;
};

export const DEFAULT_OPTIONS: Partial<PluginOptions> = {
  layers: {},
};

const pluginOptionsSchema = Joi.object<PluginOptions>({
  layers: Joi.object(),
});

export function validateOptions({
  validate,
  options,
}: OptionValidationContext<Options, PluginOptions>): PluginOptions {
  return validate(pluginOptionsSchema, options);
}
