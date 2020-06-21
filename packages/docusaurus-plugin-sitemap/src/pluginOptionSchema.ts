/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import * as Joi from '@hapi/joi';

export const PluginOptionSchema = Joi.object({
  cacheTime: Joi.number().default(600 * 1000), // 600 sec - cache purge period.
  changefreq: Joi.string().default('weekly'),
  priority: Joi.number().default(0.5),
});
