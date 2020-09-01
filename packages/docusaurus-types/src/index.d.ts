/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// ESLint doesn't understand types dependencies in d.ts
// eslint-disable-next-line import/no-extraneous-dependencies
import {Loader, Configuration} from 'webpack';
import {Command} from 'commander';
import {ParsedUrlQueryInput} from 'querystring';
import {MergeStrategy} from 'webpack-merge';

export type ReportingSeverity = 'ignore' | 'log' | 'warn' | 'error' | 'throw';

export interface DocusaurusConfig {
  baseUrl: string;
  favicon: string;
  tagline?: string;
  title: string;
  url: string;
  onBrokenLinks: ReportingSeverity;
  onDuplicateRoutes: ReportingSeverity;
  organizationName?: string;
  projectName?: string;
  githubHost?: string;
  plugins?: PluginConfig[];
  themes?: PluginConfig[];
  presets?: PresetConfig[];
  themeConfig?: {
    [key: string]: unknown;
  };
  customFields?: {
    [key: string]: unknown;
  };
  scripts?: (
    | string
    | {
        src: string;
        [key: string]: unknown;
      }
  )[];
  ssrTemplate?: string;
  stylesheets?: (
    | string
    | {
        href: string;
        [key: string]: unknown;
      }
  )[];
}

/**
 * - `type: 'package'`, plugin is in a different package.
 * - `type: 'project'`, plugin is in the same docusaurus project.
 * - `type: 'local'`, none of plugin's ancestor directory contains any package.json.
 * - `type: 'synthetic'`, docusaurus generated internal plugin.
 */
export type DocusaurusPluginVersionInformation =
  | {readonly type: 'package'; readonly version?: string}
  | {readonly type: 'project'}
  | {readonly type: 'local'}
  | {readonly type: 'synthetic'};

export interface DocusaurusSiteMetadata {
  readonly docusaurusVersion: string;
  readonly siteVersion?: string;
  readonly pluginVersions: Record<string, DocusaurusPluginVersionInformation>;
}

export interface DocusaurusContext {
  siteConfig: DocusaurusConfig;
  siteMetadata: DocusaurusSiteMetadata;
  globalData: Record<string, any>;
  isClient: boolean;
}

export interface Preset {
  plugins?: PluginConfig[];
  themes?: PluginConfig[];
}

export type PresetConfig =
  | [string, Record<string, unknown>]
  | [string]
  | string;

export interface StartCLIOptions {
  port: string;
  host: string;
  hotOnly: boolean;
  open: boolean;
  poll: boolean;
}

export interface BuildCLIOptions {
  bundleAnalyzer: boolean;
  outDir: string;
  minify: boolean;
  skipBuild: boolean;
}

export interface LoadContext {
  siteDir: string;
  generatedFilesDir: string;
  siteConfig: DocusaurusConfig;
  outDir: string;
  baseUrl: string;
  ssrTemplate?: string;
}

export interface InjectedHtmlTags {
  headTags: string;
  preBodyTags: string;
  postBodyTags: string;
}

export type HtmlTags = string | HtmlTagObject | (string | HtmlTagObject)[];

export interface Props extends LoadContext, InjectedHtmlTags {
  routes: RouteConfig[];
  routesPaths: string[];
  plugins: Plugin<any, unknown>[];
}

export interface PluginContentLoadedActions {
  addRoute(config: RouteConfig): void;
  createData(name: string, data: any): Promise<string>;
  setGlobalData<T = unknown>(data: T): void;
}

export type AllContent = Record<
  string, // plugin name
  Record<
    string, // plugin id
    unknown // plugin data
  >
>;

export interface Plugin<T, U = unknown> {
  name: string;
  loadContent?(): Promise<T>;
  validateOptions?(): ValidationResult<U>;
  validateThemeConfig?(): ValidationResult<any>;
  contentLoaded?({
    content,
    actions,
  }: {
    content: T; // the content loaded by this plugin instance
    allContent: AllContent; // content loaded by ALL the plugins
    actions: PluginContentLoadedActions;
  }): void;
  routesLoaded?(routes: RouteConfig[]): void; // TODO remove soon, deprecated (alpha-60)
  postBuild?(props: Props): void;
  postStart?(props: Props): void;
  configureWebpack?(
    config: Configuration,
    isServer: boolean,
    utils: ConfigureWebpackUtils,
  ): Configuration & {mergeStrategy?: ConfigureWebpackFnMergeStrategy};
  getThemePath?(): string;
  getTypeScriptThemePath?(): string;
  getPathsToWatch?(): string[];
  getClientModules?(): string[];
  extendCli?(cli: Command): void;
  injectHtmlTags?(): {
    headTags?: HtmlTags;
    preBodyTags?: HtmlTags;
    postBodyTags?: HtmlTags;
  };
  getSwizzleComponentList?(): string[];
}

export type ConfigureWebpackFn = Plugin<unknown>['configureWebpack'];
export type ConfigureWebpackFnMergeStrategy = Record<string, MergeStrategy>;

export type PluginOptions = {id?: string} & Record<string, unknown>;

export type PluginConfig = [string, PluginOptions] | [string] | string;

export interface ChunkRegistry {
  loader: string;
  modulePath: string;
}

export type Module =
  | {
      path: string;
      __import?: boolean;
      query?: ParsedUrlQueryInput;
    }
  | string;

export interface RouteModule {
  [module: string]: Module | RouteModule | RouteModule[];
}

export interface ChunkNames {
  [name: string]: string | null | ChunkNames | ChunkNames[];
}

export interface RouteConfig {
  path: string;
  component: string;
  modules?: RouteModule;
  routes?: RouteConfig[];
  exact?: boolean;
  priority?: number;
}

export interface ThemeAlias {
  [alias: string]: string;
}

export interface ConfigureWebpackUtils {
  getStyleLoaders: (
    isServer: boolean,
    cssOptions: {
      [key: string]: unknown;
    },
  ) => Loader[];
  getCacheLoader: (
    isServer: boolean,
    cacheOptions?: Record<string, unknown>,
  ) => Loader | null;
  getBabelLoader: (
    isServer: boolean,
    babelOptions?: Record<string, unknown>,
  ) => Loader;
}

interface HtmlTagObject {
  /**
   * Attributes of the html tag
   * E.g. `{'disabled': true, 'value': 'demo', 'rel': 'preconnect'}`
   */
  attributes?: {
    [attributeName: string]: string | boolean;
  };
  /**
   * The tag name e.g. `div`, `script`, `link`, `meta`
   */
  tagName: string;
  /**
   * The inner HTML
   */
  innerHTML?: string;
}

export interface ValidationResult<T, E extends Error = Error> {
  error?: E;
  value: T;
}

export type Validate<T, E extends Error = Error> = (
  validationSchema: ValidationSchema<T>,
  options: Partial<T>,
) => ValidationResult<T, E>;

export interface OptionValidationContext<T, E extends Error = Error> {
  validate: Validate<T, E>;
  options: Partial<T>;
}

export interface ThemeConfigValidationContext<T, E extends Error = Error> {
  validate: Validate<T, E>;
  themeConfig: Partial<T>;
}

// TODO we should use a Joi type here
export interface ValidationSchema<T> {
  validate(options: Partial<T>, opt: object): ValidationResult<T>;
  unknown(): ValidationSchema<T>;
  append(data: any): ValidationSchema<T>;
}

export interface MarkdownRightTableOfContents {
  readonly value: string;
  readonly id: string;
  readonly children: MarkdownRightTableOfContents[];
}
