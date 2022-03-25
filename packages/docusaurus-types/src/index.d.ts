/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {RuleSetRule, Configuration as WebpackConfiguration} from 'webpack';
import type {CustomizeRuleString} from 'webpack-merge/dist/types';
import type {CommanderStatic} from 'commander';
import type {ParsedUrlQueryInput} from 'querystring';
import type Joi from 'joi';
import type {Overwrite, DeepPartial} from 'utility-types';
import type {Location} from 'history';
import type Loadable from 'react-loadable';

export type ReportingSeverity = 'ignore' | 'log' | 'warn' | 'error' | 'throw';

export type ThemeConfig = {
  [key: string]: unknown;
};

// Docusaurus config, after validation/normalization
export interface DocusaurusConfig {
  baseUrl: string;
  baseUrlIssueBanner: boolean;
  favicon?: string;
  tagline: string;
  title: string;
  url: string;
  // trailingSlash undefined = legacy retrocompatible behavior
  // /file => /file/index.html
  trailingSlash: boolean | undefined;
  i18n: I18nConfig;
  onBrokenLinks: ReportingSeverity;
  onBrokenMarkdownLinks: ReportingSeverity;
  onDuplicateRoutes: ReportingSeverity;
  noIndex: boolean;
  organizationName?: string;
  projectName?: string;
  deploymentBranch?: string;
  githubHost?: string;
  githubPort?: string;
  plugins: PluginConfig[];
  themes: PluginConfig[];
  presets: PresetConfig[];
  themeConfig: ThemeConfig;
  customFields?: {
    [key: string]: unknown;
  };
  scripts: (
    | string
    | {
        src: string;
        [key: string]: unknown;
      }
  )[];
  clientModules: string[];
  ssrTemplate?: string;
  staticDirectories: string[];
  stylesheets: (
    | string
    | {
        href: string;
        [key: string]: unknown;
      }
  )[];
  titleDelimiter?: string;
  webpack?: {
    jsLoader: 'babel' | ((isServer: boolean) => RuleSetRule);
  };
}

// Docusaurus config, as provided by the user (partial/unnormalized)
// This type is used to provide type-safety / IDE auto-complete on the config
// file. See https://docusaurus.io/docs/typescript-support
export type Config = Overwrite<
  Partial<DocusaurusConfig>,
  {
    title: Required<DocusaurusConfig['title']>;
    url: Required<DocusaurusConfig['url']>;
    baseUrl: Required<DocusaurusConfig['baseUrl']>;
    i18n?: DeepPartial<DocusaurusConfig['i18n']>;
  }
>;

/**
 * - `type: 'package'`, plugin is in a different package.
 * - `type: 'project'`, plugin is in the same docusaurus project.
 * - `type: 'local'`, none of the plugin's ancestor directories contains a
 * package.json.
 * - `type: 'synthetic'`, docusaurus generated internal plugin.
 */
export type PluginVersionInformation =
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
  readonly pluginVersions: {[pluginName: string]: PluginVersionInformation};
}

// Inspired by Chrome JSON, because it's a widely supported i18n format
// https://developer.chrome.com/apps/i18n-messages
// https://support.crowdin.com/file-formats/chrome-json/
// https://www.applanga.com/docs/formats/chrome_i18n_json
// https://docs.transifex.com/formats/chrome-json
// https://help.phrase.com/help/chrome-json-messages
export type TranslationMessage = {message: string; description?: string};
export type TranslationFileContent = {[key: string]: TranslationMessage};
export type TranslationFile = {path: string; content: TranslationFileContent};
export type TranslationFiles = TranslationFile[];

export type I18nLocaleConfig = {
  label: string;
  htmlLang: string;
  direction: string;
};

export type I18nConfig = {
  defaultLocale: string;
  locales: [string, ...string[]];
  localeConfigs: {[locale: string]: Partial<I18nLocaleConfig>};
};

export type I18n = {
  defaultLocale: string;
  locales: [string, ...string[]];
  currentLocale: string;
  localeConfigs: {[locale: string]: I18nLocaleConfig};
};

export type GlobalData = {[pluginName: string]: {[pluginId: string]: unknown}};

export interface DocusaurusContext {
  siteConfig: DocusaurusConfig;
  siteMetadata: DocusaurusSiteMetadata;
  globalData: GlobalData;
  i18n: I18n;
  codeTranslations: {[msgId: string]: string};

  // Don't put mutable values here, to avoid triggering re-renders
  // We could reconsider that choice if context selectors are implemented
  // isBrowser: boolean; // Not here on purpose!
}

export interface Preset {
  plugins?: PluginConfig[];
  themes?: PluginConfig[];
}

export type PresetModule = {
  <T>(context: LoadContext, presetOptions: T): Preset;
};

export type ImportedPresetModule = PresetModule & {
  default?: PresetModule;
};

export type PresetConfig = string | [string, {[key: string]: unknown}];

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
  baseUrl: string; // TODO to remove: useless, there's already siteConfig.baseUrl!
  i18n: I18n;
  ssrTemplate: string;
  codeTranslations: {[msgId: string]: string};
}

export interface InjectedHtmlTags {
  headTags: string;
  preBodyTags: string;
  postBodyTags: string;
}

export type HtmlTags = string | HtmlTagObject | (string | HtmlTagObject)[];

export interface Props extends LoadContext, InjectedHtmlTags {
  readonly siteMetadata: DocusaurusSiteMetadata;
  readonly routes: RouteConfig[];
  readonly routesPaths: string[];
  readonly plugins: LoadedPlugin[];
}

export interface PluginContentLoadedActions {
  addRoute: (config: RouteConfig) => void;
  createData: (name: string, data: string) => Promise<string>;
  setGlobalData: (data: unknown) => void;
}

export type AllContent = {
  [pluginName: string]: {
    [pluginID: string]: unknown;
  };
};

// TODO improve type (not exposed by postcss-loader)
export type PostCssOptions = {[key: string]: unknown} & {plugins: unknown[]};

export interface Plugin<Content = unknown> {
  name: string;
  loadContent?: () => Promise<Content>;
  contentLoaded?: (args: {
    /** the content loaded by this plugin instance */
    content: Content; //
    /** content loaded by ALL the plugins */
    allContent: AllContent;
    actions: PluginContentLoadedActions;
  }) => Promise<void>;
  routesLoaded?: (routes: RouteConfig[]) => void; // TODO remove soon, deprecated (alpha-60)
  postBuild?: (props: Props & {content: Content}) => Promise<void>;
  // TODO refactor the configureWebpack API surface: use an object instead of
  // multiple params (requires breaking change)
  configureWebpack?: (
    config: WebpackConfiguration,
    isServer: boolean,
    utils: ConfigureWebpackUtils,
    content: Content,
  ) => WebpackConfiguration & {
    mergeStrategy?: ConfigureWebpackFnMergeStrategy;
  };
  configurePostCss?: (options: PostCssOptions) => PostCssOptions;
  getThemePath?: () => string;
  getTypeScriptThemePath?: () => string;
  getPathsToWatch?: () => string[];
  getClientModules?: () => string[];
  extendCli?: (cli: CommanderStatic) => void;
  injectHtmlTags?: (args: {content: Content}) => {
    headTags?: HtmlTags;
    preBodyTags?: HtmlTags;
    postBodyTags?: HtmlTags;
  };
  // TODO before/afterDevServer implementation

  // translations
  getTranslationFiles?: (args: {content: Content}) => Promise<TranslationFiles>;
  getDefaultCodeTranslationMessages?: () => Promise<{[id: string]: string}>;
  translateContent?: (args: {
    content: Content; // the content loaded by this plugin instance
    translationFiles: TranslationFiles;
  }) => Content;
  translateThemeConfig?: (args: {
    themeConfig: ThemeConfig;
    translationFiles: TranslationFiles;
  }) => ThemeConfig;
}

export type InitializedPlugin<Content = unknown> = Plugin<Content> & {
  readonly options: Required<PluginOptions>;
  readonly version: PluginVersionInformation;
  /**
   * The absolute path to the folder containing the entry point file.
   */
  readonly path: string;
};

export type LoadedPlugin<Content = unknown> = InitializedPlugin<Content> & {
  readonly content: Content;
};

export type SwizzleAction = 'eject' | 'wrap';
export type SwizzleActionStatus = 'safe' | 'unsafe' | 'forbidden';

export type SwizzleComponentConfig = {
  actions: {[action in SwizzleAction]: SwizzleActionStatus};
  description?: string;
};

export type SwizzleConfig = {
  components: {[componentName: string]: SwizzleComponentConfig};
  // Other settings could be added here,
  // For example: the ability to declare the config as exhaustive
  // so that we can emit errors
};

export type PluginModule = {
  <Options, Content>(context: LoadContext, options: Options):
    | Plugin<Content>
    | Promise<Plugin<Content>>;
  validateOptions?: <T, U>(data: OptionValidationContext<T, U>) => U;
  validateThemeConfig?: <T>(data: ThemeConfigValidationContext<T>) => T;

  getSwizzleComponentList?: () => string[] | undefined; // TODO deprecate this one later
  getSwizzleConfig?: () => SwizzleConfig | undefined;
};

export type ImportedPluginModule = PluginModule & {
  default?: PluginModule;
};

export type ConfigureWebpackFn = Plugin<unknown>['configureWebpack'];
export type ConfigureWebpackFnMergeStrategy = {
  [key: string]: CustomizeRuleString;
};
export type ConfigurePostCssFn = Plugin<unknown>['configurePostCss'];

export type PluginOptions = {id?: string} & {[key: string]: unknown};

export type PluginConfig =
  | string
  | [string, PluginOptions]
  | [PluginModule, PluginOptions]
  | PluginModule;

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
  [propName: string]: unknown;
}

export interface RouteContext {
  /**
   * Plugin-specific context data.
   */
  data?: object | undefined;
}

/**
 * Top-level plugin routes automatically add some context data to the route.
 * This permits us to know which plugin is handling the current route.
 */
export interface PluginRouteContext extends RouteContext {
  plugin: {
    id: string;
    name: string;
  };
}

export type Route = {
  readonly path: string;
  readonly component: ReturnType<typeof Loadable>;
  readonly exact?: boolean;
  readonly routes?: Route[];
};

// Aliases used for Webpack resolution (when using docusaurus swizzle)
export interface ThemeAliases {
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
    babelOptions?: {[key: string]: unknown};
  }) => RuleSetRule;
}

interface HtmlTagObject {
  /**
   * Attributes of the html tag
   * E.g. `{'disabled': true, 'value': 'demo', 'rel': 'preconnect'}`
   */
  attributes?: Partial<{[key: string]: string | boolean}>;
  /**
   * The tag name e.g. `div`, `script`, `link`, `meta`
   */
  tagName: string;
  /**
   * The inner HTML
   */
  innerHTML?: string;
}

export type ValidationSchema<T> = Joi.ObjectSchema<T>;

export type Validate<T, U> = (
  validationSchema: ValidationSchema<U>,
  options: T,
) => U;

export type OptionValidationContext<T, U> = {
  validate: Validate<T, U>;
  options: T;
};

export interface ThemeConfigValidationContext<T> {
  validate: Validate<T, T>;
  themeConfig: Partial<T>;
}

export type TOCItem = {
  readonly value: string;
  readonly id: string;
  readonly level: number;
};

export type RouteChunksTree = {[x: string | number]: string | RouteChunksTree};

export type ClientModule = {
  onRouteUpdate?: (args: {
    previousLocation: Location | null;
    location: Location;
  }) => void;
  onRouteUpdateDelayed?: (args: {location: Location}) => void;
};
