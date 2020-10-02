/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import * as Joi from '@hapi/joi';
import {PluginOptions} from './types';
import {
  RemarkPluginsSchema,
  RehypePluginsSchema,
  AdmonitionsSchema,
  URISchema,
} from '@docusaurus/utils-validation';
import {OptionValidationContext, ValidationResult} from '@docusaurus/types';
import {ValidationError} from '@hapi/joi';
import chalk from 'chalk';
import admonitions from 'remark-admonitions';

export const DEFAULT_OPTIONS: Omit<PluginOptions, 'id'> = {
  path: 'docs', // Path to data on filesystem, relative to site dir.
  routeBasePath: 'docs', // URL Route.
  homePageId: undefined, // TODO remove soon, deprecated
  include: ['**/*.{md,mdx}'], // Extensions to include.
  sidebarPath: 'sidebars.json', // Path to sidebar configuration for showing a list of markdown pages.
  docLayoutComponent: '@theme/DocPage',
  docItemComponent: '@theme/DocItem',
  remarkPlugins: [],
  rehypePlugins: [],
  beforeDefaultRemarkPlugins: [],
  beforeDefaultRehypePlugins: [],
  showLastUpdateTime: false,
  showLastUpdateAuthor: false,
  admonitions: {},
  excludeNextVersionDocs: false,
  includeCurrentVersion: true,
  disableVersioning: false,
  lastVersion: undefined,
  versions: {},
};

const VersionOptionsSchema = Joi.object({
  path: Joi.string().allow('').optional(),
  label: Joi.string().optional(),
});

const VersionsOptionsSchema = Joi.object()
  .pattern(Joi.string().required(), VersionOptionsSchema)
  .default(DEFAULT_OPTIONS.versions);

export const OptionsSchema = Joi.object({
  path: Joi.string().default(DEFAULT_OPTIONS.path),
  editUrl: URISchema,
  routeBasePath: Joi.string()
    // '' not allowed, see https://github.com/facebook/docusaurus/issues/3374
    // .allow('') ""
    .default(DEFAULT_OPTIONS.routeBasePath),
  homePageId: Joi.string().optional(),
  include: Joi.array().items(Joi.string()).default(DEFAULT_OPTIONS.include),
  sidebarPath: Joi.string().allow('').default(DEFAULT_OPTIONS.sidebarPath),
  docLayoutComponent: Joi.string().default(DEFAULT_OPTIONS.docLayoutComponent),
  docItemComponent: Joi.string().default(DEFAULT_OPTIONS.docItemComponent),
  remarkPlugins: RemarkPluginsSchema.default(DEFAULT_OPTIONS.remarkPlugins),
  rehypePlugins: RehypePluginsSchema.default(DEFAULT_OPTIONS.rehypePlugins),
  beforeDefaultRemarkPlugins: RemarkPluginsSchema.default(
    DEFAULT_OPTIONS.beforeDefaultRemarkPlugins,
  ),
  beforeDefaultRehypePlugins: RehypePluginsSchema.default(
    DEFAULT_OPTIONS.beforeDefaultRehypePlugins,
  ),
  admonitions: AdmonitionsSchema.default(DEFAULT_OPTIONS.admonitions),
  showLastUpdateTime: Joi.bool().default(DEFAULT_OPTIONS.showLastUpdateTime),
  showLastUpdateAuthor: Joi.bool().default(
    DEFAULT_OPTIONS.showLastUpdateAuthor,
  ),
  excludeNextVersionDocs: Joi.bool().default(
    DEFAULT_OPTIONS.excludeNextVersionDocs,
  ),
  includeCurrentVersion: Joi.bool().default(
    DEFAULT_OPTIONS.includeCurrentVersion,
  ),
  onlyIncludeVersions: Joi.array().items(Joi.string().required()).optional(),
  disableVersioning: Joi.bool().default(DEFAULT_OPTIONS.disableVersioning),
  lastVersion: Joi.string().optional(),
  versions: VersionsOptionsSchema,
});

// TODO bad validation function types
export function validateOptions({
  validate,
  options,
}: OptionValidationContext<PluginOptions, ValidationError>): ValidationResult<
  PluginOptions,
  ValidationError
> {
  // TODO remove homePageId before end of 2020
  // "slug: /" is better because the home doc can be different across versions
  if (options.homePageId) {
    console.log(
      chalk.red(
        `The docs plugin option homePageId=${options.homePageId} is deprecated. To make a doc the "home", prefer frontmatter: "slug: /"`,
      ),
    );
  }

  if (typeof options.excludeNextVersionDocs !== 'undefined') {
    console.log(
      chalk.red(
        `The docs plugin option excludeNextVersionDocs=${
          options.excludeNextVersionDocs
        } is deprecated. Use the includeCurrentVersion=${!options.excludeNextVersionDocs} option instead!"`,
      ),
    );
    options.includeCurrentVersion = !options.excludeNextVersionDocs;
  }

  // @ts-expect-error: TODO bad OptionValidationContext, need refactor
  const normalizedOptions: PluginOptions = validate(OptionsSchema, options);

  if (normalizedOptions.admonitions) {
    normalizedOptions.remarkPlugins = normalizedOptions.remarkPlugins.concat([
      [admonitions, normalizedOptions.admonitions],
    ]);
  }

  // @ts-expect-error: TODO bad OptionValidationContext, need refactor
  return normalizedOptions;
}
