/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import {PluginOptions} from './types';
import {
  Joi,
  RemarkPluginsSchema,
  RehypePluginsSchema,
  AdmonitionsSchema,
  URISchema,
} from '@docusaurus/utils-validation';
import {GlobExcludeDefault} from '@docusaurus/utils';

import {OptionValidationContext, ValidationResult} from '@docusaurus/types';
import chalk from 'chalk';
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
  homePageId: undefined, // TODO remove soon, deprecated
  include: ['**/*.{md,mdx}'], // Extensions to include.
  exclude: GlobExcludeDefault,
  sidebarItemsGenerator: DefaultSidebarItemsGenerator,
  numberPrefixParser: DefaultNumberPrefixParser,
  docLayoutComponent: '@theme/DocPage',
  docItemComponent: '@theme/DocItem',
  docTagDocListComponent: '@theme/DocTagDocListPage',
  docTagsListComponent: '@theme/DocTagsListPage',
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
  homePageId: Joi.string().optional(),
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
      console.warn(
        chalk.yellow(
          'The docs plugin config is inconsistent. It does not make sense to use sidebarCollapsible=false and sidebarCollapsed=true at the same time. sidebarCollapsed=false will be ignored.',
        ),
      );
      options = {
        ...options,
        sidebarCollapsed: false,
      };
    }
  }

  // TODO remove homePageId before end of 2020
  // "slug: /" is better because the home doc can be different across versions
  if (options.homePageId) {
    console.log(
      chalk.red(
        `The docs plugin option homePageId=${options.homePageId} is deprecated. To make a doc the "home", prefer frontmatter: "slug: /"`,
      ),
    );
  }

  const normalizedOptions = validate(OptionsSchema, options);

  if (normalizedOptions.admonitions) {
    normalizedOptions.remarkPlugins = normalizedOptions.remarkPlugins.concat([
      [admonitions, normalizedOptions.admonitions],
    ]);
  }

  return normalizedOptions;
}
