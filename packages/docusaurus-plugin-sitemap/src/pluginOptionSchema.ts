/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import * as Joi from '@hapi/joi';
import {PluginOptions} from './types';

export const DEFAULT_OPTIONS: PluginOptions = {
  cacheTime: 600 * 1000, // 600 sec - cache purge period.
  changefreq: 'weekly',
  priority: 0.5,
};

export const PluginOptionSchema = Joi.object({
  cacheTime: Joi.number().positive().default(DEFAULT_OPTIONS.cacheTime),
  changefreq: Joi.string()
    .valid('always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never')
    .default(DEFAULT_OPTIONS.changefreq),
  priority: Joi.number().min(0).max(1).default(DEFAULT_OPTIONS.priority),
});
