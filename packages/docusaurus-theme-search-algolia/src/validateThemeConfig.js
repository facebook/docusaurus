/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const Joi = require('@hapi/joi');

const DEFAULT_CONFIG = {
  // By default, all Docusaurus sites are using the same AppId
  // This has been designed on purpose with Algolia.
  appId: 'BH4D9OD16A',
};
exports.DEFAULT_CONFIG = DEFAULT_CONFIG;

const Schema = Joi.object({
  algolia: Joi.object({
    appId: Joi.string().default(DEFAULT_CONFIG.appId),
    apiKey: Joi.string().required(),
    indexName: Joi.string().required(),
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
  return validate(Schema, themeConfig);
};
