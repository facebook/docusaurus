/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {Joi} from '@docusaurus/utils-validation';
import type {OptionValidationContext} from '@docusaurus/types';
import type {PluginOptions} from '@docusaurus/plugin-pwa';

const DEFAULT_OPTIONS = {
  debug: false,
  offlineModeActivationStrategies: [
    'appInstalled',
    'queryString',
    'standalone',
  ],
  injectManifestConfig: {},
  pwaHead: [],
  swCustom: undefined,
  swRegister: './registerSw.js',
};

const optionsSchema = Joi.object<PluginOptions>({
  debug: Joi.bool().default(DEFAULT_OPTIONS.debug),
  offlineModeActivationStrategies: Joi.array()
    .items(
      Joi.string()
        .valid(
          'appInstalled',
          'queryString',
          'standalone',
          'mobile',
          'saveData',
          'always',
        )
        .required(),
    )
    .default(DEFAULT_OPTIONS.offlineModeActivationStrategies),
  injectManifestConfig: Joi.object().default(
    DEFAULT_OPTIONS.injectManifestConfig,
  ),
  pwaHead: Joi.array()
    .items(Joi.object({tagName: Joi.string().required()}).unknown().required())
    .default(DEFAULT_OPTIONS.pwaHead),
  swCustom: Joi.string(),
  swRegister: Joi.alternatives()
    .try(Joi.string(), Joi.bool().valid(false))
    .default(DEFAULT_OPTIONS.swRegister),
  // @ts-expect-error: forbidden
  reloadPopup: Joi.any().forbidden().messages({
    'any.unknown':
      'The reloadPopup option is removed in favor of swizzling. See https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-pwa#customizing-reload-popup for how to customize the reload popup using swizzling.',
  }),
});

export function validateOptions({
  validate,
  options,
}: OptionValidationContext<PluginOptions, PluginOptions>): PluginOptions {
  return validate(optionsSchema, options);
}
