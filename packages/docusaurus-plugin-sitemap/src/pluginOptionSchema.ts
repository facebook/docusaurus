/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {Joi} from '@docusaurus/utils-validation';
import {EnumChangefreq} from 'sitemap';
import type {Options} from '@docusaurus/plugin-sitemap';

export const DEFAULT_OPTIONS: Required<Options> = {
  changefreq: EnumChangefreq.WEEKLY,
  priority: 0.5,
  trailingSlash: false,
};

export const PluginOptionSchema = Joi.object({
  // TODO temporary (@alpha-71)
  cacheTime: Joi.forbidden().messages({
    'any.unknown':
      'Option `cacheTime` in sitemap config is deprecated. Please remove it.',
  }),
  changefreq: Joi.string()
    .valid(...Object.values(EnumChangefreq))
    .default(DEFAULT_OPTIONS.changefreq),
  priority: Joi.number().min(0).max(1).default(DEFAULT_OPTIONS.priority),
  trailingSlash: Joi.bool().default(false).warning('deprecate.error', {
    msg: 'Please use the new Docusaurus global trailingSlash config instead, and the sitemaps plugin will use it.',
  }),
}).messages({
  'deprecate.error':
    'Option {#label} of the sitemap plugin is deprecated: {#msg}',
});
