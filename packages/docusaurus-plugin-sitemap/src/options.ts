/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {Joi} from '@docusaurus/utils-validation';
import {EnumChangefreq} from 'sitemap';
import type {OptionValidationContext} from '@docusaurus/types';

export type PluginOptions = {
  /** @see https://www.sitemaps.org/protocol.html#xmlTagDefinitions */
  changefreq: EnumChangefreq;
  /** @see https://www.sitemaps.org/protocol.html#xmlTagDefinitions */
  priority: number;
  /**
   * A list of glob patterns; matching route paths will be filtered from the
   * sitemap. Note that you may need to include the base URL in here.
   */
  ignorePatterns: string[];
  /**
   * The path to the created sitemap file, relative to the output directory.
   * Useful if you have two plugin instances outputting two files.
   */
  filename: string;
};

export type Options = Partial<PluginOptions>;

export const DEFAULT_OPTIONS: PluginOptions = {
  changefreq: EnumChangefreq.WEEKLY,
  priority: 0.5,
  ignorePatterns: [],
  filename: 'sitemap.xml',
};

const PluginOptionSchema = Joi.object<PluginOptions>({
  // @ts-expect-error: forbidden
  cacheTime: Joi.forbidden().messages({
    'any.unknown':
      'Option `cacheTime` in sitemap config is deprecated. Please remove it.',
  }),
  changefreq: Joi.string()
    .valid(...Object.values(EnumChangefreq))
    .default(DEFAULT_OPTIONS.changefreq),
  priority: Joi.number().min(0).max(1).default(DEFAULT_OPTIONS.priority),
  ignorePatterns: Joi.array()
    .items(Joi.string())
    .default(DEFAULT_OPTIONS.ignorePatterns),
  trailingSlash: Joi.forbidden().messages({
    'any.unknown':
      'Please use the new Docusaurus global trailingSlash config instead, and the sitemaps plugin will use it.',
  }),
  filename: Joi.string().default(DEFAULT_OPTIONS.filename),
});

export function validateOptions({
  validate,
  options,
}: OptionValidationContext<Options, PluginOptions>): PluginOptions {
  const validatedOptions = validate(PluginOptionSchema, options);
  return validatedOptions;
}
