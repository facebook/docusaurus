/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// ESLint doesn't understand types dependencies in d.ts
// eslint-disable-next-line import/no-extraneous-dependencies
import type {RuleSetRule, Configuration} from 'webpack';
import type {Command} from 'commander';
import type {ParsedUrlQueryInput} from 'querystring';
import type Joi from 'joi';

// Convert webpack-merge webpack-merge enum to union type
// For type retro-compatible webpack-merge upgrade: we used string literals before)
// see https://github.com/survivejs/webpack-merge/issues/179
type MergeStrategy = 'match' | 'merge' | 'append' | 'prepend' | 'replace';

export type ReportingSeverity = 'ignore' | 'log' | 'warn' | 'error' | 'throw';

export type ThemeConfig = {
  [key: string]: unknown;
};

export interface DocusaurusConfig {
  baseUrl: string;
  baseUrlIssueBanner: boolean;
  favicon: string;
  tagline?: string;
  title: string;
  url: string;
  i18n: I18nConfig;
  onBrokenLinks: ReportingSeverity;
  onBrokenMarkdownLinks: ReportingSeverity;
  onDuplicateRoutes: ReportingSeverity;
  noIndex: boolean;
  organizationName?: string;
  projectName?: string;
  githubHost?: string;
  githubPort?: string;
  plugins?: PluginConfig[];
  themes?: PluginConfig[];
  presets?: PresetConfig[];
  themeConfig: ThemeConfig;
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
  clientModules?: string[];
  ssrTemplate?: string;
  stylesheets?: (
    | string
    | {
        href: string;
        [key: string]: unknown;
      }
  )[];
  titleDelimiter?: string;
}

/**
 * - `type: 'package'`, plugin is in a different package.
 * - `type: 'project'`, plugin is in the same docusaurus project.
 * - `type: 'local'`, none of plugin's ancestor directory contains any package.json.
 * - `type: 'synthetic'`, docusaurus generated internal plugin.
 */
export type DocusaurusPluginVersionInformation =
  | {
      readonly type: 'package';
      readonly name?: string;
      readonly version?: string;
    }
  | {readonly type: 'project'}
  | {readonly type: 'local'}
  | {readonly type: 'synthetic'};

export interface DocusaurusSiteMetadata {
  readonly docusaurusVersion: string;
  readonly siteVersion?: string;
  readonly pluginVersions: Record<string, DocusaurusPluginVersionInformation>;
}

// Inspired by Chrome JSON, because it's a widely supported i18n format
// https://developer.chrome.com/apps/i18n-messages
// https://support.crowdin.com/file-formats/chrome-json/
// https://www.applanga.com/docs/formats/chrome_i18n_json
// https://docs.transifex.com/formats/chrome-json
// https://help.phrase.com/help/chrome-json-messages
export type TranslationMessage = {message: string; description?: string};
export type TranslationFileContent = Record<string, TranslationMessage>;
export type TranslationFile = {path: string; content: TranslationFileContent};
export type TranslationFiles = TranslationFile[];

export type I18nLocaleConfig = {
  label: string;
  direction: string;
};

export type I18nConfig = {
  defaultLocale: string;
  locales: [string, ...string[]];
  localeConfigs: Record<string, Partial<I18nLocaleConfig>>;
};

export type I18n = {
  defaultLocale: string;
  locales: [string, ...string[]];
  currentLocale: string;
  localeConfigs: Record<string, I18nLocaleConfig>;
};

export interface DocusaurusContext {
  siteConfig: DocusaurusConfig;
  siteMetadata: DocusaurusSiteMetadata;
  globalData: Record<string, unknown>;
  i18n: I18n;
  codeTranslations: Record<string, string>;
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

export type HostPortCLIOptions = {
  host?: string;
  port?: string;
};

export type ConfigOptions = {
  config: string;
};

export type StartCLIOptions = HostPortCLIOptions &
  ConfigOptions & {
    hotOnly: boolean;
    open: boolean;
    poll: boolean | number;
    locale?: string;
  };

export type ServeCLIOptions = HostPortCLIOptions &
  ConfigOptions & {
    dir: string;
    build: boolean;
  };

export type BuildOptions = ConfigOptions & {
  bundleAnalyzer: boolean;
  outDir: string;
  minify: boolean;
  skipBuild: boolean;
};

export type BuildCLIOptions = BuildOptions & {
  locale?: string;
};

export interface LoadContext {
  siteDir: string;
  generatedFilesDir: string;
  siteConfig: DocusaurusConfig;
  siteConfigPath: string;
  outDir: string;
  baseUrl: string;
  i18n: I18n;
  ssrTemplate?: string;
  codeTranslations: Record<string, string>;
}

export interface InjectedHtmlTags {
  headTags: string;
  preBodyTags: string;
  postBodyTags: string;
}

export type HtmlTags = string | HtmlTagObject | (string | HtmlTagObject)[];

export interface Props extends LoadContext, InjectedHtmlTags {
  siteMetadata: DocusaurusSiteMetadata;
  routes: RouteConfig[];
  routesPaths: string[];
  plugins: Plugin<unknown>[];
}

export interface PluginContentLoadedActions {
  addRoute(config: RouteConfig): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

// TODO improve type (not exposed by postcss-loader)
export type PostCssOptions = Record<string, unknown> & {plugins: unknown[]};

export interface Plugin<Content> {
  name: string;
  loadContent?(): Promise<Content>;
  contentLoaded?({
    content,
    actions,
  }: {
    content: Content; // the content loaded by this plugin instance
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
  configurePostCss?(options: PostCssOptions): PostCssOptions;
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
  // TODO before/afterDevServer implementation

  // translations
  getTranslationFiles?({
    content,
  }: {
    content: Content;
  }): Promise<TranslationFiles>;
  getDefaultCodeTranslationMessages?(): Promise<
    Record<
      string, // id
      string // message
    >
  >;
  translateContent?({
    content,
    translationFiles,
  }: {
    content: Content; // the content loaded by this plugin instance
    translationFiles: TranslationFiles;
  }): Content;
  translateThemeConfig?({
    themeConfig,
    translationFiles,
  }: {
    themeConfig: ThemeConfig;
    translationFiles: TranslationFiles;
  }): ThemeConfig;
}

export type PluginModule = {
  <T, X>(context: LoadContext, options: T): Plugin<X>;
  validateOptions?<T>(data: OptionValidationContext<T>): T;
  validateThemeConfig?<T>(data: ThemeConfigValidationContext<T>): T;
  getSwizzleComponentList?(): string[];
};

export type ImportedPluginModule = PluginModule & {
  default?: PluginModule;
};

export type ConfigureWebpackFn = Plugin<unknown>['configureWebpack'];
export type ConfigureWebpackFnMergeStrategy = Record<string, MergeStrategy>;
export type ConfigurePostCssFn = Plugin<unknown>['configurePostCss'];

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
  ) => RuleSetRule[];
  getJSLoader: (options: {
    isServer: boolean;
    babelOptions?: Record<string, unknown>;
  }) => RuleSetRule;

  // TODO deprecated: remove before end of 2021?
  getCacheLoader: (
    isServer: boolean,
    cacheOptions?: Record<string, unknown>,
  ) => RuleSetRule | null;

  // TODO deprecated: remove before end of 2021?
  getBabelLoader: (
    isServer: boolean,
    options?: Record<string, unknown>,
  ) => RuleSetRule;
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

export type ValidationResult<T> = T;

export type ValidationSchema<T> = Joi.ObjectSchema<T>;

export type Validate<T> = (
  validationSchema: ValidationSchema<T>,
  options: Partial<T>,
) => ValidationResult<T>;

export interface OptionValidationContext<T> {
  validate: Validate<T>;
  options: Partial<T>;
}

export interface ThemeConfigValidationContext<T> {
  validate: Validate<T>;
  themeConfig: Partial<T>;
}

export interface TOCItem {
  readonly value: string;
  readonly id: string;
  readonly children: TOCItem[];
}
