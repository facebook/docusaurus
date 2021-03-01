/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const Joi = require('joi');

const DEFAULT_CONFIG = {
  showResultBeforeEditor: false,
};
exports.DEFAULT_CONFIG = DEFAULT_CONFIG;

const Schema = Joi.object({
  liveCodeblock: Joi.object({
    showResultBeforeEditor: Joi.boolean().default(
      DEFAULT_CONFIG.showResultBeforeEditor,
    ),
  })
    .label('themeConfig.liveCodeblock')
    .default(DEFAULT_CONFIG),
});
exports.Schema = Schema;

exports.validateThemeConfig = function ({validate, themeConfig}) {
  return validate(Schema, themeConfig);
};
