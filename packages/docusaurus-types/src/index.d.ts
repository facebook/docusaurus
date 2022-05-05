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
  /** The label displayed for this locale in the locales dropdown. */
  label: string;
  /**
   * BCP 47 language tag to use in `<html lang="...">` and in
   * `<link ... hreflang="...">`
   */
  htmlLang: string;
  /** Used to select the locale's CSS and html meta attribute. */
  direction: 'ltr' | 'rtl';
  /**
   * The [calendar](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale/calendar)
   * used to calculate the date era. Note that it doesn't control the actual
   * string displayed: `MM/DD/YYYY` and `DD/MM/YYYY` are both gregory. To choose
   * the format (`DD/MM/YYYY` or `MM/DD/YYYY`), set your locale name to `en-GB`
   * or `en-US` (`en` means `en-US`).
   */
  calendar: string;
};

export type I18nConfig = {
  /**
   * The locale that:
   * 1. Does not have its name in the base URL
   * 2. Gets started with `docusaurus start` without `--locale` option
   * 3. Will be used for the `<link hrefLang="x-default">` tag
   */
  defaultLocale: string;
  /** List of locales deployed on your site. Must contain `defaultLocale`. */
  locales: [string, ...string[]];
  /** Individual options for each locale. */
  localeConfigs: {[locale: string]: Partial<I18nLocaleConfig>};
};

/**
 * Docusaurus config, after validation/normalization.
 */
export type DocusaurusConfig = {
  /**
   * Title for your website. Will be used in metadata and as browser tab title.
   *
   * @see https://docusaurus.io/docs/api/docusaurus-config#title
   */
  title: string;
  /**
   * URL for your website. This can also be considered the top-level hostname.
   * For example, `https://facebook.github.io` is the URL of
   * https://facebook.github.io/metro/, and `https://docusaurus.io` is the URL
   * for https://docusaurus.io.
   *
   * @see https://docusaurus.io/docs/api/docusaurus-config#url
   */
  url: string;
  /**
   * Can be considered as the path after the host. For example, `/metro/` is the
   * base URL of https://facebook.github.io/metro/. For URLs that have no path,
   * it should be set to `/`. Always has both leading and trailing slash.
   *
   * @see https://docusaurus.io/docs/api/docusaurus-config#baseUrl
   */
  baseUrl: string;
  /**
   * Path to your site favicon; must be a URL that can be used in link's href.
   *
   * @see https://docusaurus.io/docs/api/docusaurus-config#favicon
   */
  favicon?: string;
  /**
   * Allow to customize the presence/absence of a trailing slash at the end of
   * URLs/links, and how static HTML files are generated:
   *
   * - `undefined` (default): keeps URLs untouched, and emit
   *   `/docs/myDoc/index.html` for `/docs/myDoc.md`
   * - `true`: add trailing slashes to URLs/links, and emit
   *   `/docs/myDoc/index.html` for `/docs/myDoc.md`
   * - `false`: remove trailing slashes from URLs/links, and emit
   *   `/docs/myDoc.html` for `/docs/myDoc.md`
   *
   * @see https://github.com/slorber/trailing-slash-guide
   * @see https://docusaurus.io/docs/api/docusaurus-config#trailingSlash
   * @default undefined
   */
  trailingSlash: boolean | undefined;
  /**
   * The i18n configuration object to [localize your
   * site](https://docusaurus.io/docs/i18n/introduction).
   *
   * @see https://docusaurus.io/docs/api/docusaurus-config#i18n
   */
  i18n: I18nConfig;
  /**
   * This option adds `<meta name="robots" content="noindex, nofollow">` to
   * every page to tell search engines to avoid indexing your site.
   *
   * @see https://moz.com/learn/seo/robots-meta-directives
   * @see https://docusaurus.io/docs/api/docusaurus-config#noIndex
   * @default false
   */
  noIndex: boolean;
  /**
   * The behavior of Docusaurus when it detects any broken link.
   *
   * @see https://docusaurus.io/docs/api/docusaurus-config#onBrokenLinks
   * @default "throw"
   */
  onBrokenLinks: ReportingSeverity;
  /**
   * The behavior of Docusaurus when it detects any broken markdown link.
   *
   * @see https://docusaurus.io/docs/api/docusaurus-config#onBrokenMarkdownLinks
   * @default "warn"
   */
  onBrokenMarkdownLinks: ReportingSeverity;
  /**
   * The behavior of Docusaurus when it detects any [duplicate
   * routes](https://docusaurus.io/docs/creating-pages#duplicate-routes).
   *
   * @see https://docusaurus.io/docs/api/docusaurus-config#onDuplicateRoutes
   * @default "warn"
   */
  onDuplicateRoutes: ReportingSeverity;
  /**
   * The tagline for your website.
   *
   * @see https://docusaurus.io/docs/api/docusaurus-config#tagline
   * @default ""
   */
  tagline: string;
  /**
   * The GitHub user or organization that owns the repository. You don't need
   * this if you are not using the `docusaurus deploy` command.
   *
   * @see https://docusaurus.io/docs/api/docusaurus-config#organizationName
   */
  organizationName?: string;
  /**
   * The name of the GitHub repository. You don't need this if you are not using
   * the `docusaurus deploy` command.
   *
   * @see https://docusaurus.io/docs/api/docusaurus-config#projectName
   */
  projectName?: string;
  /**
   * The name of the branch to deploy the static files to. You don't need this
   * if you are not using the `docusaurus deploy` command.
   *
   * @see https://docusaurus.io/docs/api/docusaurus-config#deploymentBranch
   */
  deploymentBranch?: string;
  /**
   * The hostname of your server. Useful if you are using GitHub Enterprise. You
   * don't need this if you are not using the `docusaurus deploy` command.
   *
   * @see https://docusaurus.io/docs/api/docusaurus-config#githubHost
   */
  githubHost?: string;
  /**
   * The port of your server. Useful if you are using GitHub Enterprise. You
   * don't need this if you are not using the `docusaurus deploy` command.
   *
   * @see https://docusaurus.io/docs/api/docusaurus-config#githubPort
   */
  githubPort?: string;
  /**
   * The [theme configuration](https://docusaurus.io/docs/api/themes/configuration)
   * object to customize your site UI like navbar and footer.
   *
   * @see https://docusaurus.io/docs/api/docusaurus-config#themeConfig
   * @default {}
   */
  themeConfig: ThemeConfig;
  /**
   * List of plugins.
   *
   * @see https://docusaurus.io/docs/api/docusaurus-config#plugins
   * @default []
   */
  plugins: PluginConfig[];
  /**
   * List of themes.
   *
   * @see https://docusaurus.io/docs/api/docusaurus-config#themes
   * @default []
   */
  themes: PluginConfig[];
  /**
   * List of presets.
   *
   * @see https://docusaurus.io/docs/api/docusaurus-config#presets
   * @default []
   */
  presets: PresetConfig[];
  /**
   * Docusaurus guards `docusaurus.config.js` from unknown fields. To add a
   * custom field, define it on `customFields`.
   *
   * @see https://docusaurus.io/docs/api/docusaurus-config#customFields
   * @default {}
   */
  customFields?: {
    [key: string]: unknown;
  };
  /**
   * An array of paths, relative to the site's directory or absolute. Files
   * under these paths will be copied to the build output as-is.
   *
   * @see https://docusaurus.io/docs/api/docusaurus-config#staticDirectories
   * @default ["static"]
   */
  staticDirectories: string[];
  /**
   * An array of scripts to load. The values can be either strings or plain
   * objects of attribute-value maps. The `<script>` tags will be inserted in
   * the HTML `<head>`.
   *
   * Note that `<script>` added here are render-blocking, so you might want to
   * add `async: true`/`defer: true` to the objects.
   *
   * @see https://docusaurus.io/docs/api/docusaurus-config#scripts
   * @default []
   */
  scripts: (
    | string
    | {
        src: string;
        [key: string]: string | boolean | undefined;
      }
  )[];
  /**
   * An array of CSS sources to load. The values can be either strings or plain
   * objects of attribute-value maps. The `<link>` tags will be inserted in the
   * HTML `<head>`.
   *
   * @see https://docusaurus.io/docs/api/docusaurus-config#stylesheets
   * @default []
   */
  stylesheets: (
    | string
    | {
        href: string;
        [key: string]: string | boolean | undefined;
      }
  )[];
  /**
   * An array of [client modules](https://docusaurus.io/docs/advanced/client#client-modules)
   * to load globally on your site.
   *
   * @see https://docusaurus.io/docs/api/docusaurus-config#clientModules
   * @default []
   */
  clientModules: string[];
  /**
   * An HTML template written in [Eta's syntax](https://eta.js.org/docs/syntax#syntax-overview)
   * that will be used to render your application. This can be used to set
   * custom attributes on the `body` tags, additional `meta` tags, customize the
   * `viewport`, etc. Please note that Docusaurus will rely on the template to
   * be correctly structured in order to function properly, once you do
   * customize it, you will have to make sure that your template is compliant
   * with the requirements from upstream.
   *
   * @see https://docusaurus.io/docs/api/docusaurus-config#ssrTemplate
   */
  ssrTemplate?: string;
  /**
   * Will be used as title delimiter in the generated `<title>` tag.
   *
   * @see https://docusaurus.io/docs/api/docusaurus-config#titleDelimiter
   * @default "|"
   */
  titleDelimiter: string;
  /**
   * When enabled, will show a banner in case your site can't load its CSS or
   * JavaScript files, which is a very common issue, often related to a wrong
   * `baseUrl` in site config.
   *
   * @see https://docusaurus.io/docs/api/docusaurus-config#baseUrlIssueBanner
   * @default true
   */
  baseUrlIssueBanner: boolean;
  /** Webpack-related options. */
  webpack?: {
    /**
     * Configuration for alternative JS loaders. "babel" will use the built-in
     * Babel loader and preset; otherwise, you can provide your custom Webpack
     * rule set.
     */
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

export type LoadContext = {
  siteDir: string;
  generatedFilesDir: string;
  siteConfig: DocusaurusConfig;
  siteConfigPath: string;
  outDir: string;
  /**
   * Duplicated from `siteConfig.baseUrl`, but probably worth keeping. We mutate
   * `siteConfig` to make `baseUrl` there localized as well, but that's mostly
   * for client-side. `context.baseUrl` is still more convenient for plugins.
   */
  baseUrl: string;
  i18n: I18n;
  codeTranslations: CodeTranslations;
};

export type Props = LoadContext & {
  headTags: string;
  preBodyTags: string;
  postBodyTags: string;
  siteMetadata: SiteMetadata;
  routes: RouteConfig[];
  routesPaths: string[];
  plugins: LoadedPlugin[];
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
    cssOptions: {[key: string]: unknown},
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
export type PostCssOptions = {plugins: unknown[]; [key: string]: unknown};

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
  // Other settings could be added here, like the ability to declare the config
  // as exhaustive so that we can emit errors
};

export type PluginModule = {
  (context: LoadContext, options: unknown): Plugin | Promise<Plugin>;
  validateOptions?: <T, U>(data: OptionValidationContext<T, U>) => U;
  validateThemeConfig?: <T>(data: ThemeConfigValidationContext<T>) => T;

  getSwizzleComponentList?: () => string[] | undefined; // TODO deprecate this one later
  getSwizzleConfig?: () => SwizzleConfig | undefined;
};

export type Preset = {
  plugins?: PluginConfig[];
  themes?: PluginConfig[];
};

export type PresetModule = {
  (context: LoadContext, presetOptions: unknown): Preset;
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

export type ClientModule = {
  onRouteDidUpdate?: (args: {
    previousLocation: Location | null;
    location: Location;
  }) => (() => void) | void;
  onRouteUpdate?: (args: {
    previousLocation: Location | null;
    location: Location;
  }) => (() => void) | void;
};

export type UseDataOptions = {
  /**
   * Throw an error, or simply return undefined if the data cannot be found. Use
   * `true` if you are sure the data must exist.
   */
  failfast?: boolean;
};
