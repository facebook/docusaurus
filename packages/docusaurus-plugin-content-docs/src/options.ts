/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {PluginOptions} from './types';
import {
  Joi,
  RemarkPluginsSchema,
  RehypePluginsSchema,
  AdmonitionsSchema,
  URISchema,
} from '@docusaurus/utils-validation';
import {GlobExcludeDefault} from '@docusaurus/utils';

import type {
  OptionValidationContext,
  ValidationResult,
} from '@docusaurus/types';
import logger from '@docusaurus/logger';
import admonitions from 'remark-admonitions';
import {DefaultSidebarItemsGenerator} from './sidebars/generator';
import {
  DefaultNumberPrefixParser,
  DisabledNumberPrefixParser,
} from './numberPrefix';

export const DEFAULT_OPTIONS: Omit<PluginOptions, 'id' | 'sidebarPath'> = {
  path: 'docs', // Path to data on filesystem, relative to site dir.
  routeBasePath: 'docs', // URL Route.
  tagsBasePath: 'tags', // URL Tags Route.
  include: ['**/*.{md,mdx}'], // Extensions to include.
  exclude: GlobExcludeDefault,
  sidebarItemsGenerator: DefaultSidebarItemsGenerator,
  numberPrefixParser: DefaultNumberPrefixParser,
  docLayoutComponent: '@theme/DocPage',
  docItemComponent: '@theme/DocItem',
  docTagDocListComponent: '@theme/DocTagDocListPage',
  docTagsListComponent: '@theme/DocTagsListPage',
  docCategoryGeneratedIndexComponent: '@theme/DocCategoryGeneratedIndexPage',
  remarkPlugins: [],
  rehypePlugins: [],
  beforeDefaultRemarkPlugins: [],
  beforeDefaultRehypePlugins: [],
  showLastUpdateTime: false,
  showLastUpdateAuthor: false,
  admonitions: {},
  includeCurrentVersion: true,
  disableVersioning: false,
  lastVersion: undefined,
  versions: {},
  editCurrentVersion: false,
  editLocalizedFiles: false,
  sidebarCollapsible: true,
  sidebarCollapsed: true,
};

const VersionOptionsSchema = Joi.object({
  path: Joi.string().allow('').optional(),
  label: Joi.string().optional(),
  banner: Joi.string().equal('none', 'unreleased', 'unmaintained').optional(),
  badge: Joi.boolean().optional(),
  className: Joi.string().optional(),
});

const VersionsOptionsSchema = Joi.object()
  .pattern(Joi.string().required(), VersionOptionsSchema)
  .default(DEFAULT_OPTIONS.versions);

export const OptionsSchema = Joi.object({
  path: Joi.string().default(DEFAULT_OPTIONS.path),
  editUrl: Joi.alternatives().try(URISchema, Joi.function()),
  editCurrentVersion: Joi.boolean().default(DEFAULT_OPTIONS.editCurrentVersion),
  editLocalizedFiles: Joi.boolean().default(DEFAULT_OPTIONS.editLocalizedFiles),
  routeBasePath: Joi.string()
    // '' not allowed, see https://github.com/facebook/docusaurus/issues/3374
    // .allow('') ""
    .default(DEFAULT_OPTIONS.routeBasePath),
  tagsBasePath: Joi.string().default(DEFAULT_OPTIONS.tagsBasePath),
  homePageId: Joi.any().forbidden().messages({
    'any.unknown':
      'The docs plugin option homePageId is not supported anymore. To make a doc the "home", please add "slug: /" in its front matter. See: https://docusaurus.io/docs/next/docs-introduction#home-page-docs',
  }),

  include: Joi.array().items(Joi.string()).default(DEFAULT_OPTIONS.include),
  exclude: Joi.array().items(Joi.string()).default(DEFAULT_OPTIONS.exclude),
  sidebarPath: Joi.alternatives().try(
    Joi.boolean().invalid(true),
    Joi.string(),
  ),
  sidebarItemsGenerator: Joi.function().default(
    () => DEFAULT_OPTIONS.sidebarItemsGenerator,
  ),
  sidebarCollapsible: Joi.boolean().default(DEFAULT_OPTIONS.sidebarCollapsible),
  sidebarCollapsed: Joi.boolean().default(DEFAULT_OPTIONS.sidebarCollapsed),
  numberPrefixParser: Joi.alternatives()
    .try(
      Joi.function(),
      // Convert boolean values to functions
      Joi.alternatives().conditional(Joi.boolean(), {
        then: Joi.custom((val) =>
          val ? DefaultNumberPrefixParser : DisabledNumberPrefixParser,
        ),
      }),
    )
    .default(() => DEFAULT_OPTIONS.numberPrefixParser),
  docLayoutComponent: Joi.string().default(DEFAULT_OPTIONS.docLayoutComponent),
  docItemComponent: Joi.string().default(DEFAULT_OPTIONS.docItemComponent),
  docTagsListComponent: Joi.string().default(
    DEFAULT_OPTIONS.docTagsListComponent,
  ),
  docTagDocListComponent: Joi.string().default(
    DEFAULT_OPTIONS.docTagDocListComponent,
  ),
  docCategoryGeneratedIndexComponent: Joi.string().default(
    DEFAULT_OPTIONS.docCategoryGeneratedIndexComponent,
  ),
  remarkPlugins: RemarkPluginsSchema.default(DEFAULT_OPTIONS.remarkPlugins),
  rehypePlugins: RehypePluginsSchema.default(DEFAULT_OPTIONS.rehypePlugins),
  beforeDefaultRemarkPlugins: RemarkPluginsSchema.default(
    DEFAULT_OPTIONS.beforeDefaultRemarkPlugins,
  ),
  beforeDefaultRehypePlugins: RehypePluginsSchema.default(
    DEFAULT_OPTIONS.beforeDefaultRehypePlugins,
  ),
  admonitions: Joi.alternatives()
    .try(AdmonitionsSchema, Joi.boolean().invalid(true))
    .default(DEFAULT_OPTIONS.admonitions),
  showLastUpdateTime: Joi.bool().default(DEFAULT_OPTIONS.showLastUpdateTime),
  showLastUpdateAuthor: Joi.bool().default(
    DEFAULT_OPTIONS.showLastUpdateAuthor,
  ),
  includeCurrentVersion: Joi.bool().default(
    DEFAULT_OPTIONS.includeCurrentVersion,
  ),
  onlyIncludeVersions: Joi.array().items(Joi.string().required()).optional(),
  disableVersioning: Joi.bool().default(DEFAULT_OPTIONS.disableVersioning),
  lastVersion: Joi.string().optional(),
  versions: VersionsOptionsSchema,
});

export function validateOptions({
  validate,
  options: userOptions,
}: OptionValidationContext<PluginOptions>): ValidationResult<PluginOptions> {
  let options = userOptions;

  if (options.sidebarCollapsible === false) {
    // When sidebarCollapsible=false and sidebarCollapsed=undefined, we don't want to have the inconsistency warning
    // We let options.sidebarCollapsible become the default value for options.sidebarCollapsed
    if (typeof options.sidebarCollapsed === 'undefined') {
      options = {
        ...options,
        sidebarCollapsed: false,
      };
    }
    if (options.sidebarCollapsed) {
      logger.warn`The docs plugin config is inconsistent. It does not make sense to use code=${'sidebarCollapsible: false'} and code=${'sidebarCollapsed: true'} at the same time. code=${'sidebarCollapsed: true'} will be ignored.`;
      options = {
        ...options,
        sidebarCollapsed: false,
      };
    }
  }

  const normalizedOptions = validate(OptionsSchema, options);

  if (normalizedOptions.admonitions) {
    normalizedOptions.remarkPlugins = normalizedOptions.remarkPlugins.concat([
      [admonitions, normalizedOptions.admonitions],
    ]);
  }

  return normalizedOptions;
}
