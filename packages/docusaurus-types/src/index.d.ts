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
import type {HelmetServerState} from 'react-helmet-async';
import type {
  DeepRequired,
  Required as RequireKeys,
  DeepPartial,
} from 'utility-types';
import type {Location} from 'history';

// === Configuration ===

export type ReportingSeverity = 'ignore' | 'log' | 'warn' | 'error' | 'throw';

export type PluginOptions = {id?: string} & {[key: string]: unknown};

export type PluginConfig =
  | string
  | [string, PluginOptions]
  | [PluginModule, PluginOptions]
  | PluginModule
  | false
  | null;

export type PresetConfig =
  | string
  | [string, {[key: string]: unknown}]
  | false
  | null;

export type ThemeConfig = {
  [key: string]: unknown;
};

export type I18nLocaleConfig = {
  label: string;
  htmlLang: string;
  direction: string;
  calendar: string;
};

export type I18nConfig = {
  defaultLocale: string;
  locales: [string, ...string[]];
  localeConfigs: {[locale: string]: Partial<I18nLocaleConfig>};
};

/**
 * Docusaurus config, after validation/normalization.
 */
export type DocusaurusConfig = {
  /**
   * Always has both leading and trailing slash (`/base/`). May be localized.
   */
  baseUrl: string;
  baseUrlIssueBanner: boolean;
  favicon?: string;
  tagline: string;
  title: string;
  url: string;
  /**
   * `undefined` = legacy retrocompatible behavior. Usually it means `/file` =>
   * `/file/index.html`.
   */
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
        [key: string]: string | boolean | undefined;
      }
  )[];
  clientModules: string[];
  ssrTemplate?: string;
  staticDirectories: string[];
  stylesheets: (
    | string
    | {
        href: string;
        [key: string]: string | boolean | undefined;
      }
  )[];
  titleDelimiter?: string;
  webpack?: {
    jsLoader: 'babel' | ((isServer: boolean) => RuleSetRule);
  };
};

/**
 * Docusaurus config, as provided by the user (partial/unnormalized). This type
 * is used to provide type-safety / IDE auto-complete on the config file.
 * @see https://docusaurus.io/docs/typescript-support
 */
export type Config = RequireKeys<
  DeepPartial<DocusaurusConfig>,
  'title' | 'url' | 'baseUrl'
>;

// === Data loading ===

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

export type SiteMetadata = {
  readonly docusaurusVersion: string;
  readonly siteVersion?: string;
  readonly pluginVersions: {[pluginName: string]: PluginVersionInformation};
};

/**
 * Inspired by Chrome JSON, because it's a widely supported i18n format
 * @see https://developer.chrome.com/apps/i18n-messages
 * @see https://support.crowdin.com/file-formats/chrome-json/
 * @see https://www.applanga.com/docs/formats/chrome_i18n_json
 * @see https://docs.transifex.com/formats/chrome-json
 * @see https://help.phrase.com/help/chrome-json-messages
 */
export type TranslationMessage = {message: string; description?: string};
export type TranslationFileContent = {[msgId: string]: TranslationMessage};
/**
 * An abstract representation of how a translation file exists on disk. The core
 * would handle the file reading/writing; plugins just need to deal with
 * translations in-memory.
 */
export type TranslationFile = {
  /**
   * Relative to the directory where it's expected to be found. For plugin
   * files, it's relative to `i18n/<locale>/<pluginName>/<pluginId>`. Should NOT
   * have any extension.
   */
  path: string;
  content: TranslationFileContent;
};

export type I18n = DeepRequired<I18nConfig> & {currentLocale: string};

export type GlobalData = {[pluginName: string]: {[pluginId: string]: unknown}};

export type CodeTranslations = {[msgId: string]: string};

export type DocusaurusContext = {
  siteConfig: DocusaurusConfig;
  siteMetadata: SiteMetadata;
  globalData: GlobalData;
  i18n: I18n;
  codeTranslations: CodeTranslations;

  // Don't put mutable values here, to avoid triggering re-renders
  // We could reconsider that choice if context selectors are implemented
  // isBrowser: boolean; // Not here on purpose!
};

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

export type BuildCLIOptions = ConfigOptions & {
  bundleAnalyzer: boolean;
  outDir: string;
  minify: boolean;
  skipBuild: boolean;
  locale?: string;
};

export type LoadContext = {
  siteDir: string;
  generatedFilesDir: string;
  siteConfig: DocusaurusConfig;
  siteConfigPath: string;
  outDir: string;
  /**
   * Duplicated from `siteConfig.baseUrl`, but probably worth keeping. We mutate
   * `siteConfig` to make `baseUrl` there localized  as well, but that's mostly
   * for client-side. `context.baseUrl` is still more convenient for plugins.
   */
  baseUrl: string;
  i18n: I18n;
  codeTranslations: CodeTranslations;
};

export type Props = LoadContext & {
  readonly headTags: string;
  readonly preBodyTags: string;
  readonly postBodyTags: string;
  readonly siteMetadata: SiteMetadata;
  readonly routes: RouteConfig[];
  readonly routesPaths: string[];
  readonly plugins: LoadedPlugin[];
};

// === Plugin ===

export type PluginContentLoadedActions = {
  addRoute: (config: RouteConfig) => void;
  createData: (name: string, data: string) => Promise<string>;
  setGlobalData: (data: unknown) => void;
};

export type ConfigureWebpackUtils = {
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
};

export type AllContent = {
  [pluginName: string]: {
    [pluginID: string]: unknown;
  };
};

// TODO improve type (not exposed by postcss-loader)
export type PostCssOptions = {[key: string]: unknown} & {plugins: unknown[]};

type HtmlTagObject = {
  /**
   * Attributes of the html tag.
   * E.g. `{ disabled: true, value: "demo", rel: "preconnect" }`
   */
  attributes?: Partial<{[key: string]: string | boolean}>;
  /** The tag name, e.g. `div`, `script`, `link`, `meta` */
  tagName: string;
  /** The inner HTML */
  innerHTML?: string;
};

export type HtmlTags = string | HtmlTagObject | (string | HtmlTagObject)[];

export type ValidationSchema<T> = Joi.ObjectSchema<T>;

export type Validate<T, U> = (
  validationSchema: ValidationSchema<U>,
  options: T,
) => U;

export type OptionValidationContext<T, U> = {
  validate: Validate<T, U>;
  options: T;
};

export type ThemeConfigValidationContext<T> = {
  validate: Validate<T, T>;
  themeConfig: Partial<T>;
};

export type Plugin<Content = unknown> = {
  name: string;
  loadContent?: () => Promise<Content> | Content;
  contentLoaded?: (args: {
    /** The content loaded by this plugin instance */
    content: Content; //
    /** Content loaded by ALL the plugins */
    allContent: AllContent;
    actions: PluginContentLoadedActions;
  }) => Promise<void> | void;
  postBuild?: (
    props: Props & {
      content: Content;
      head: {[location: string]: HelmetServerState};
    },
  ) => Promise<void> | void;
  // TODO refactor the configureWebpack API surface: use an object instead of
  // multiple params (requires breaking change)
  configureWebpack?: (
    config: WebpackConfiguration,
    isServer: boolean,
    utils: ConfigureWebpackUtils,
    content: Content,
  ) => WebpackConfiguration & {
    mergeStrategy?: {
      [key: string]: CustomizeRuleString;
    };
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
  getTranslationFiles?: (args: {
    content: Content;
  }) => Promise<TranslationFile[]> | TranslationFile[];
  getDefaultCodeTranslationMessages?: () =>
    | Promise<{[id: string]: string}>
    | {[id: string]: string};
  translateContent?: (args: {
    /** The content loaded by this plugin instance. */
    content: Content;
    translationFiles: TranslationFile[];
  }) => Content;
  translateThemeConfig?: (args: {
    themeConfig: ThemeConfig;
    translationFiles: TranslationFile[];
  }) => ThemeConfig;
};

export type NormalizedPluginConfig = {
  /**
   * The default export of the plugin module, or alternatively, what's provided
   * in the config file as inline plugins. Note that if a file is like:
   *
   * ```ts
   * export default plugin() {...}
   * export validateOptions() {...}
   * ```
   *
   * Then the static methods may not exist here. `pluginModule.module` will
   * always take priority.
   */
  plugin: PluginModule;
  /** Options as they are provided in the config, not validated yet. */
  options: PluginOptions;
  /** Only available when a string is provided in config. */
  pluginModule?: {
    /**
     * Raw module name as provided in the config. Shorthands have been resolved,
     * so at least it's directly `require.resolve`able.
     */
    path: string;
    /** Whatever gets imported with `require`. */
    module: ImportedPluginModule;
  };
  /**
   * Different from `pluginModule.path`, this one is always an absolute path,
   * used to resolve relative paths returned from lifecycles. If it's an inline
   * plugin, it will be path to the config file.
   */
  entryPath: string;
};

export type InitializedPlugin = Plugin & {
  readonly options: Required<PluginOptions>;
  readonly version: PluginVersionInformation;
  /** The absolute path to the folder containing the entry point file. */
  readonly path: string;
};

export type LoadedPlugin = InitializedPlugin & {
  readonly content: unknown;
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
  (context: LoadContext, options: unknown): Plugin | Promise<Plugin>;
  validateOptions?: <T, U>(data: OptionValidationContext<T, U>) => U;
  validateThemeConfig?: <T>(data: ThemeConfigValidationContext<T>) => T;

  getSwizzleComponentList?: () => string[] | undefined; // TODO deprecate this one later
  getSwizzleConfig?: () => SwizzleConfig | undefined;
};

export type ImportedPluginModule = PluginModule & {
  default?: PluginModule;
};

export type Preset = {
  plugins?: PluginConfig[];
  themes?: PluginConfig[];
};

export type PresetModule = {
  <T>(context: LoadContext, presetOptions: T): Preset;
};

export type ImportedPresetModule = PresetModule & {
  default?: PresetModule;
};

// === Route registry ===

/**
 * A "module" represents a unit of serialized data emitted from the plugin. It
 * will be imported on client-side and passed as props, context, etc.
 *
 * If it's a string, it's a file path that Webpack can `require`; if it's
 * an object, it can also contain `query` or other metadata.
 */
export type Module =
  | {
      /**
       * A marker that tells the route generator this is an import and not a
       * nested object to recurse.
       */
      __import?: boolean;
      path: string;
      query?: ParsedUrlQueryInput;
    }
  | string;

/**
 * Represents the data attached to each route. Since the routes.js is a
 * monolithic data file, any data (like props) should be serialized separately
 * and registered here as file paths (a {@link Module}), so that we could
 * code-split.
 */
export type RouteModules = {
  [propName: string]: Module | RouteModules | RouteModules[];
};

/**
 * Represents a "slice" of the final route structure returned from the plugin
 * `addRoute` action.
 */
export type RouteConfig = {
  /** With leading slash. Trailing slash will be normalized by config. */
  path: string;
  /** Component used to render this route, a path that Webpack can `require`. */
  component: string;
  /**
   * Props. Each entry should be `[propName]: pathToPropModule` (created with
   * `createData`)
   */
  modules?: RouteModules;
  /**
   * The route context will wrap the `component`. Use `useRouteContext` to
   * retrieve what's declared here. Note that all custom route context declared
   * here will be namespaced under {@link RouteContext.data}.
   */
  context?: RouteModules;
  /** Nested routes config. */
  routes?: RouteConfig[];
  /** React router config option: `exact` routes would not match subroutes. */
  exact?: boolean;
  /** Used to sort routes. Higher-priority routes will be placed first. */
  priority?: number;
  /** Extra props; will be copied to routes.js. */
  [propName: string]: unknown;
};

export type RouteContext = {
  /**
   * Plugin-specific context data.
   */
  data?: object | undefined;
};

/**
 * Top-level plugin routes automatically add some context data to the route.
 * This permits us to know which plugin is handling the current route.
 */
export type PluginRouteContext = RouteContext & {
  plugin: {
    id: string;
    name: string;
  };
};

/**
 * The shape would be isomorphic to {@link RouteModules}:
 * {@link Module} -> `string`, `RouteModules[]` -> `ChunkNames[]`.
 *
 * Each `string` chunk name will correlate with one key in the {@link Registry}.
 */
export type ChunkNames = {
  [propName: string]: string | ChunkNames | ChunkNames[];
};

/**
 * A map from route paths (with a hash) to the chunk names of each module, which
 * the bundler will collect.
 *
 * Chunk keys are routes with a hash, because 2 routes can conflict with each
 * other if they have the same path, e.g.: parent=/docs, child=/docs
 *
 * @see https://github.com/facebook/docusaurus/issues/2917
 */
export type RouteChunkNames = {
  [routePathHashed: string]: ChunkNames;
};

/**
 * Each key is the chunk name, which you can get from `routeChunkNames` (see
 * {@link RouteChunkNames}). The values are the opts data that react-loadable
 * needs. For example:
 *
 * ```js
 * const options = {
 *   optsLoader: {
 *     component: () => import('./Pages.js'),
 *     content.foo: () => import('./doc1.md'),
 *   },
 *   optsModules: ['./Pages.js', './doc1.md'],
 *   optsWebpack: [
 *     require.resolveWeak('./Pages.js'),
 *     require.resolveWeak('./doc1.md'),
 *   ],
 * }
 * ```
 *
 * @see https://github.com/jamiebuilds/react-loadable#declaring-which-modules-are-being-loaded
 */
export type Registry = {
  readonly [chunkName: string]: [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Loader: () => Promise<any>,
    ModuleName: string,
    ResolvedModuleName: string,
  ];
};

/**
 * Aliases used for Webpack resolution (useful for implementing swizzling)
 */
export type ThemeAliases = {
  [alias: string]: string;
};

export type TOCItem = {
  readonly value: string;
  readonly id: string;
  readonly level: number;
};

export type ClientModule = {
  onRouteUpdate?: (args: {
    previousLocation: Location | null;
    location: Location;
  }) => void;
  onRouteUpdateDelayed?: (args: {location: Location}) => void;
};

/** What the user configures. */
export type Tag = {
  label: string;
  /** Permalink to this tag's page, without the `/tags/` base path. */
  permalink: string;
};

/** What the tags list page should know about each tag. */
export type TagsListItem = Tag & {
  /** Number of posts/docs with this tag. */
  count: number;
};

/** What the tag's own page should know about the tag. */
export type TagModule = TagsListItem & {
  /** The tags list page's permalink. */
  allTagsPath: string;
};

export type UseDataOptions = {
  /**
   * Throw an error, or simply return undefined if the data cannot be found. Use
   * `true` if you are sure the data must exist.
   */
  failfast?: boolean;
};
