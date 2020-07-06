/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const Joi = require('@hapi/joi');
const path = require('path');

const DEFAULT_OPTIONS = {
  debug: false,
  alwaysPrecache: false,
  injectManifestConfig: {},
  pwaHead: [],
  swCustom: undefined,
  swRegister: path.join(__dirname, 'registerSw.js'),
  popup: '@theme/PwaReloadPopup',
};

exports.PluginOptionSchema = Joi.object({
  debug: Joi.bool().default(DEFAULT_OPTIONS.debug),
  alwaysPrecache: Joi.bool().default(DEFAULT_OPTIONS.alwaysPrecache),
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
  popup: Joi.string().default(DEFAULT_OPTIONS.popup),
});
