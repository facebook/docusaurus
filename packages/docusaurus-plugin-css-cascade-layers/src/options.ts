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

// Not ideal to compute layers using "filePath.includes()"
// But this is mostly temporary until we add first-class layers everywhere
function layerFor(...params: string[]) {
  return (filePath: string) => params.some((p) => filePath.includes(p));
}

export const DEFAULT_LAYERS: PluginOptions['layers'] = {
  'docusaurus.infima': layerFor('node_modules/infima/dist'),
  'docusaurus.theme-common': layerFor(
    'packages/docusaurus-theme-common/lib',
    'node_modules/@docusaurus/theme-common/lib',
  ),
  'docusaurus.theme-classic': layerFor(
    'packages/docusaurus-theme-classic/lib',
    'node_modules/@docusaurus/theme-common/lib',
  ),
};

export const DEFAULT_OPTIONS: Partial<PluginOptions> = {
  layers: DEFAULT_LAYERS,
};

const pluginOptionsSchema = Joi.object<PluginOptions>({
  layers: Joi.object()
    .pattern(Joi.string().required(), Joi.function().arity(1).required())
    .default(DEFAULT_LAYERS),
});

export function validateOptions({
  validate,
  options,
}: OptionValidationContext<Options, PluginOptions>): PluginOptions {
  return validate(pluginOptionsSchema, options);
}
