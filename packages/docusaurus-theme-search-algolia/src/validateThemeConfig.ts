/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {Joi} from '@docusaurus/utils-validation';
import type {ThemeConfig, Validate, ValidationResult} from '@docusaurus/types';

export const DEFAULT_CONFIG = {
  // enabled by default, as it makes sense in most cases
  // see also https://github.com/facebook/docusaurus/issues/5880
  contextualSearch: true,

  // By default, all Docusaurus sites are using the same AppId
  // This has been designed on purpose with Algolia.
  appId: 'BH4D9OD16A',

  searchParameters: {},
};

export const Schema = Joi.object({
  algolia: Joi.object({
    // Docusaurus attributes
    contextualSearch: Joi.boolean().default(DEFAULT_CONFIG.contextualSearch),
    externalUrlRegex: Joi.string().optional(),
    // Algolia attributes
    appId: Joi.string().default(DEFAULT_CONFIG.appId),
    apiKey: Joi.string().required(),
    indexName: Joi.string().required(),
    searchParameters: Joi.object()
      .default(DEFAULT_CONFIG.searchParameters)
      .unknown(),
  })
    .label('themeConfig.algolia')
    .required()
    .unknown(), // DocSearch 3 is still alpha: don't validate the rest for now
});

export function validateThemeConfig({
  validate,
  themeConfig,
}: {
  validate: Validate<ThemeConfig>;
  themeConfig: ThemeConfig;
}): ValidationResult<ThemeConfig> {
  return validate(Schema, themeConfig);
}
