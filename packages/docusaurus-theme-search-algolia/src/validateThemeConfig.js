/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const Joi = require('joi');

const DEFAULT_CONFIG = {
  contextualSearch: false, // future: maybe we want to enable this by default

  // By default, all Docusaurus sites are using the same AppId
  // This has been designed on purpose with Algolia.
  appId: 'BH4D9OD16A',

  searchParameters: {},
};
exports.DEFAULT_CONFIG = DEFAULT_CONFIG;

const Schema = Joi.object({
  algolia: Joi.object({
    // Docusaurus attributes
    contextualSearch: Joi.boolean().default(DEFAULT_CONFIG.contextualSearch),

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
exports.Schema = Schema;

exports.validateThemeConfig = function validateThemeConfig({
  validate,
  themeConfig,
}) {
  const normalizedThemeConfig = validate(Schema, themeConfig);

  if (
    normalizedThemeConfig &&
    normalizedThemeConfig.algolia.contextualSearch &&
    normalizedThemeConfig.algolia.searchParameters &&
    normalizedThemeConfig.algolia.searchParameters.facetFilters
  ) {
    throw new Error(
      'If you are using algolia.contextualSearch: true, you should not provide algolia.searchParameters.facetFilters, as it is computed for you dynamically',
    );
  }
  return normalizedThemeConfig;
};
