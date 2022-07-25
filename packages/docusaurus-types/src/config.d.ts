/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {RuleSetRule} from 'webpack';
import type {Required as RequireKeys, DeepPartial} from 'utility-types';
import type {I18nConfig} from './i18n';
import type {PluginConfig, PresetConfig} from './plugin';

export type ReportingSeverity = 'ignore' | 'log' | 'warn' | 'throw';

export type ThemeConfig = {
  [key: string]: unknown;
};

/**
 * Contains URL to image or path to local image relative to your site's "static"
 * directory. Can be an external URL.
 *
 * Alternatively, a function can be specified to generate URLs
 * dynamically based on page data. Example function in documentation.
 *
 * Used for `og:image` and `twitter:image` meta tags.
 *
 * @see https://docusaurus.io/docs/api/docusaurus-config#socialCardService
 */
export type SocialCardService = {
  url: string | SocialCardFunction;
  options?: SocialCardOptions;
};

/** Function to generate URLs based on page data. Runs in a Node
 * environment, allowing access to Node APIs (e.g. fs).
 *
 * The function can specify the social card URL for all pages except
 * for JSX pages.
 *
 * In React Docusaurus context (useDocusaurusContext), serialized to
 * the URL returned when called with `data = { type: 'default' }`.
 * The default URL is set automatically, so **you should not need to
 * call `url` in React.**
 *
 * @see https://docusaurus.io/docs/api/docusaurus-config#socialCardService
 */
export type SocialCardFunction = (
  data: SocialCardData,
  options?: SocialCardOptions,
) => string;

/**
 * Options that are primarily designed to be used for the default
 * Docusaurus social card service or one that follows the same
 * query parameter pattern.
 *
 * Can be accessed in React.
 *
 * @see insert link to Docusaurus service GitHub
 */
export type SocialCardOptions = {
  /**
   * Name of project to be displayed on card.
   * @default undefined
   */
  projectName?: string;
  /**
   * URL to image. Can also be a path relative to your website's "static"
   * directory.
   * @default undefined
   */
  projectLogo?: string;
  /**
   * Whether to display "made with Docusaurus" text on card.
   * @default true
   */
  docusaurus?: boolean;
  /**
   * Whether to parse `title` as markdown or plaintext.
   * @default true
   */
  markdown?: boolean;
  /**
   * Whether to have light or dark theme cards.
   * @default "light"
   */
  theme?: 'light' | 'dark';
  /**
   * URL to social card service. Useful if your social card service follows the
   * same query parameter pattern as the Docusaurus social card service.
   * @see insert link to Docusaurus service GitHub
   * @default "https://docusaurus-og-image.vercel.app/"
   */
  baseUrl?: string;
};

/**
 * Data passed into `url`.
 */
export type SocialCardData = {
  type: 'docs' | 'blog' | 'page' | 'default';
  /**
   * Can use Markdown.
   */
  title?: string;
  /**
   * Can be used to differentiate between specific pages
   */
  permalink?: string;
  /**
   * Only available in blog posts.
   */
  authorName?: string;
  /**
   * Only available in blog posts.
   */
  authorImage?: string;
  /**
   * Only available in docs.
   */
  version?: string;
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
  /**
   * Link to social card image or function to generate social card images.
   * Links can be full URLs, including external URLs, or paths relative to
   * your site's "static" directory
   */
  socialCardService: SocialCardService;
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
