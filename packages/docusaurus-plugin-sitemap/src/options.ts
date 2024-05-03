/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {Joi} from '@docusaurus/utils-validation';
import {ChangeFreqList, LastModOptionList} from './types';
import type {OptionValidationContext} from '@docusaurus/types';
import type {
  ChangeFreq,
  LastModOption,
  SitemapItem,
  CreateSitemapItemsFn,
  CreateSitemapItemsParams,
} from './types';

export type PluginOptions = {
  /**
   * The path to the created sitemap file, relative to the output directory.
   * Useful if you have two plugin instances outputting two files.
   */
  filename: string;

  /**
   * A list of glob patterns; matching route paths will be filtered from the
   * sitemap. Note that you may need to include the base URL in here.
   */
  ignorePatterns: string[];

  /**
   * Defines the format of the "lastmod" sitemap item entry, between:
   * - null: do not compute/add a "lastmod" sitemap entry
   * - "date": add a "lastmod" sitemap entry without time (YYYY-MM-DD)
   * - "datetime": add a "lastmod" sitemap entry with time (ISO 8601 datetime)
   * @see https://www.sitemaps.org/protocol.html#xmlTagDefinitions
   * @see https://www.w3.org/TR/NOTE-datetime
   */
  lastmod: LastModOption | null;

  /**
   * TODO Docusaurus v4 breaking change: remove useless option
   * @see https://www.sitemaps.org/protocol.html#xmlTagDefinitions
   */
  changefreq: ChangeFreq | null;

  /**
   * TODO Docusaurus v4 breaking change: remove useless option
   * @see https://www.sitemaps.org/protocol.html#xmlTagDefinitions
   */
  priority: number | null;

  /** Allow control over the construction of SitemapItems */
  createSitemapItems?: CreateSitemapItemsOption;
};

type CreateSitemapItemsOption = (
  params: CreateSitemapItemsParams & {
    defaultCreateSitemapItems: CreateSitemapItemsFn;
  },
) => Promise<SitemapItem[]>;

export type Options = Partial<PluginOptions>;

export const DEFAULT_OPTIONS: PluginOptions = {
  filename: 'sitemap.xml',
  ignorePatterns: [],

  // TODO Docusaurus v4 breaking change
  //  change default to "date" if no bug or perf issue reported
  lastmod: null,

  // TODO Docusaurus v4 breaking change
  //  those options are useless and should be removed
  changefreq: 'weekly',
  priority: 0.5,
};

const PluginOptionSchema = Joi.object<PluginOptions>({
  // @ts-expect-error: forbidden
  cacheTime: Joi.forbidden().messages({
    'any.unknown':
      'Option `cacheTime` in sitemap config is deprecated. Please remove it.',
  }),

  // TODO remove for Docusaurus v4 breaking changes?
  //  This is not even used by Google crawlers
  //  See also https://github.com/facebook/docusaurus/issues/2604
  changefreq: Joi.string()
    .valid(null, ...ChangeFreqList)
    .default(DEFAULT_OPTIONS.changefreq),

  // TODO remove for Docusaurus v4 breaking changes?
  //  This is not even used by Google crawlers
  //  The priority is "relative", and using the same priority for all routes
  //  does not make sense according to the spec
  //  See also https://github.com/facebook/docusaurus/issues/2604
  //  See also https://www.sitemaps.org/protocol.html
  priority: Joi.alternatives()
    .try(Joi.valid(null), Joi.number().min(0).max(1))
    .default(DEFAULT_OPTIONS.priority),

  lastmod: Joi.string()
    .valid(null, ...LastModOptionList)
    .default(DEFAULT_OPTIONS.lastmod),

  createSitemapItems: Joi.function(),

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
