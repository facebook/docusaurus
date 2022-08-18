/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/// <reference types="@docusaurus/module-type-aliases" />

declare module '@docusaurus/plugin-content-docs' {
  import type {MDXOptions, LoadedMDXContent} from '@docusaurus/mdx-loader';

  import type {
    ContentPaths,
    FrontMatterTag,
    TagsListItem,
    TagModule,
    Tag,
  } from '@docusaurus/utils';
  import type {Plugin, LoadContext} from '@docusaurus/types';
  import type {Overwrite, Required} from 'utility-types';

  export type Assets = {
    image?: string;
  };

  export type FileChange = {
    author?: string;
    /** Date can be any
     * [parsable date string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse).
     */
    date?: Date | string;
  };

  /**
   * Custom callback for parsing number prefixes from file/folder names.
   */
  export type NumberPrefixParser = (filename: string) => {
    /** File name without number prefix, without any other modification. */
    filename: string;
    /** The number prefix. Can be float, integer, negative, or anything. */
    numberPrefix?: number;
  };

  export type CategoryIndexMatcher = (param: {
    /** The file name, without extension */
    fileName: string;
    /**
     * The list of directories, from lowest level to highest.
     * If there's no dir name, directories is ['.']
     */
    directories: string[];
    /** The extension, with a leading dot */
    extension: string;
  }) => boolean;

  export type EditUrlFunction = (editUrlParams: {
    /** Name of the version. */
    version: string;
    /**
     * Path of the version's root content path, relative to the site directory.
     * Usually the same as `options.path` but can be localized or versioned.
     */
    versionDocsDirPath: string;
    /** Path of the doc file, relative to `versionDocsDirPath`. */
    docPath: string;
    /** @see {@link DocMetadata.permalink} */
    permalink: string;
    /** Locale name. */
    locale: string;
  }) => string | undefined;

  export type MetadataOptions = {
    /**
     * URL route for the docs section of your site. **DO NOT** include a
     * trailing slash. Use `/` for shipping docs without base path.
     */
    routeBasePath: string;
    /**
     * Base URL to edit your site. The final URL is computed by `editUrl +
     * relativeDocPath`. Using a function allows more nuanced control for each
     * file. Omitting this variable entirely will disable edit links.
     */
    editUrl?: string | EditUrlFunction;
    /**
     * The edit URL will always target the current version doc instead of older
     * versions. Ignored when `editUrl` is a function.
     */
    editCurrentVersion: boolean;
    /**
     * The edit URL will target the localized file, instead of the original
     * unlocalized file. Ignored when `editUrl` is a function.
     */
    editLocalizedFiles: boolean;
    /**	Whether to display the last date the doc was updated. */
    showLastUpdateTime?: boolean;
    /** Whether to display the author who last updated the doc. */
    showLastUpdateAuthor?: boolean;
    /**
     * Custom parsing logic to extract number prefixes from file names. Use
     * `false` to disable this behavior and leave the docs untouched, and `true`
     * to use the default parser.
     *
     * @param filename One segment of the path, without any slashes.
     * @see https://docusaurus.io/docs/sidebar#using-number-prefixes
     */
    numberPrefixParser: NumberPrefixParser;
    /** Enable or disable the breadcrumbs on doc pages. */
    breadcrumbs: boolean;
  };

  export type PathOptions = {
    /**
     * Path to the docs content directory on the file system, relative to site
     * directory.
     */
    path: string;
    /**
     * Path to sidebar configuration. Use `false` to disable sidebars, or
     * `undefined` to create a fully autogenerated sidebar.
     */
    sidebarPath?: string | false | undefined;
  };

  // TODO support custom version banner?
  // {type: "error", content: "html content"}
  export type VersionBanner = 'unreleased' | 'unmaintained';

  export type VersionOptions = {
    /**
     * The base path of the version, will be appended to `baseUrl` +
     * `routeBasePath`.
     */
    path?: string;
    /** The label of the version to be used in badges, dropdowns, etc. */
    label?: string;
    /** The banner to show at the top of a doc of that version. */
    banner?: 'none' | VersionBanner;
    /** Show a badge with the version label at the top of each doc. */
    badge?: boolean;
    /** Prevents search engines from indexing this version */
    noIndex?: boolean;
    /** Add a custom class name to the <html> element of each doc. */
    className?: string;
  };

  export type VersionsOptions = {
    /**
     * The version navigated to in priority and displayed by default for docs
     * navbar items.
     *
     * @see https://docusaurus.io/docs/versioning#terminology
     */
    lastVersion?: string;
    /** Only include a subset of all available versions. */
    onlyIncludeVersions?: string[];
    /**
     * Explicitly disable versioning even when multiple versions exist. This
     * will make the site only include the current version. Will error if
     * `includeCurrentVersion: false` and `disableVersioning: true`.
     */
    disableVersioning: boolean;
    /** Include the current version of your docs. */
    includeCurrentVersion: boolean;
    /** Independent customization of each version's properties. */
    versions: {[versionName: string]: VersionOptions};
  };
  export type SidebarOptions = {
    /**
     * Whether sidebar categories are collapsible by default.
     *
     * @see https://docusaurus.io/docs/sidebar#collapsible-categories
     */
    sidebarCollapsible: boolean;
    /**
     * Whether sidebar categories are collapsed by default.
     *
     * @see https://docusaurus.io/docs/sidebar#expanded-categories-by-default
     */
    sidebarCollapsed: boolean;
  };

  export type PluginOptions = MetadataOptions &
    PathOptions &
    VersionsOptions &
    MDXOptions &
    SidebarOptions & {
      /** Plugin ID. */
      id: string;
      /**
       * Array of glob patterns matching Markdown files to be built, relative to
       * the content path.
       */
      include: string[];
      /**
       * Array of glob patterns matching Markdown files to be excluded. Serves
       * as refinement based on the `include` option.
       */
      exclude: string[];
      /**
       * Parent component of all the docs plugin pages (all versions).
       * Stays mounted when navigation between versions.
       */
      docsRootComponent: string;
      /**
       * Parent component of all versioned docs pages:
       * - docs pages with sidebars
       * - tags pages
       * Stays mounted when navigation between such pages.
       */
      docVersionRootComponent: string;
      /**
       * Parent component of all docs pages with sidebars:
       * - regular docs pages
       * - category generated index pages
       * Stays mounted when navigation between such pages.
       */
      docRootComponent: string;
      /** Main doc container, with TOC, pagination, etc. */
      docItemComponent: string;
      /** Root component of the "docs containing tag X" page. */
      docTagDocListComponent: string;
      /** Root component of the tags list page */
      docTagsListComponent: string;
      /** Root component of the generated category index page. */
      docCategoryGeneratedIndexComponent: string;
      sidebarItemsGenerator: import('./sidebars/types').SidebarItemsGeneratorOption;
      /**
       * URL route for the tags section of your doc version. Will be appended to
       * `routeBasePath`. **DO NOT** include a trailing slash.
       */
      tagsBasePath: string;
    };
  export type Options = Partial<
    Overwrite<
      PluginOptions,
      {
        /**
         * Custom parsing logic to extract number prefixes from file names. Use
         * `false` to disable this behavior and leave the docs untouched, and
         * `true` to use the default parser.
         *
         * @param filename One segment of the path, without any slashes.
         * @see https://docusaurus.io/docs/sidebar#using-number-prefixes
         */
        numberPrefixParser: PluginOptions['numberPrefixParser'] | boolean;
      }
    >
  >;
  export type SidebarsConfig = import('./sidebars/types').SidebarsConfig;

  export type VersionMetadata = ContentPaths & {
    /** A name like `1.0.0`. Acquired from `versions.json`. */
    versionName: string;
    /** Like `Version 1.0.0`. Can be configured through `versions.label`. */
    label: string;
    /**
     * Version's base path in the form of `/<baseUrl>/<routeBasePath>/1.0.0`.
     * Can be configured through `versions.path`.
     */
    path: string;
    /** Tags base path in the form of `<versionPath>/tags`. */
    tagsPath: string;
    /**
     * The base URL to which the doc file path will be appended. Will be
     * `undefined` if `editUrl` is `undefined` or a function.
     */
    editUrl?: string | undefined;
    /**
     * The base URL to which the localized doc file path will be appended. Will
     * be `undefined` if `editUrl` is `undefined` or a function.
     */
    editUrlLocalized?: string | undefined;
    /**
     * "unmaintained" is the version before latest; "unreleased" is the version
     * after latest. `null` is the latest version without a banner. Can be
     * configured with `versions.banner`: `banner: "none"` will be transformed
     * to `null` here.
     */
    banner: VersionBanner | null;
    /** Show a badge with the version label at the top of each doc. */
    badge: boolean;
    /** Prevents search engines from indexing this version */
    noIndex: boolean;
    /** Add a custom class name to the <html> element of each doc. */
    className: string;
    /**
     * Whether this version is the "last" version. Can be configured with
     * `lastVersion` option.
     */
    isLast: boolean;
    /**
     * Like `versioned_sidebars/1.0.0.json`. Versioned sidebars file may be
     * nonexistent since we don't create empty files.
     */
    sidebarFilePath: string | false | undefined;
    /**
     * Will be -1 for the latest docs, and `undefined` for everything else.
     * Because `/docs/foo` should always be after `/docs/<versionName>/foo`.
     */
    routePriority: number | undefined;
  };

  export type DocFrontMatter = {
    /**
     * The last part of the doc ID (will be refactored in the future to be the
     * full ID instead)
     * @see {@link DocMetadata.id}
     */
    id?: string;
    /**
     * Will override the default title collected from h1 heading.
     * @see {@link DocMetadata.title}
     */
    title?: string;
    /**
     * Front matter tags, unnormalized.
     * @see {@link DocMetadata.tags}
     */
    tags?: FrontMatterTag[];
    /**
     * If there isn't a Markdown h1 heading (which, if there is, we don't
     * remove), this front matter will cause the front matter title to not be
     * displayed in the doc page.
     */
    hide_title?: boolean;
    /** Hide the TOC on the right. */
    hide_table_of_contents?: boolean;
    /** Used in the head meta. */
    keywords?: string[];
    /** Used in the head meta. Should use `assets.image` in priority. */
    image?: string;
    /**
     * Will override the default excerpt.
     * @see {@link DocMetadata.description}
     */
    description?: string;
    /**
     * Custom slug appended after /<baseUrl>/<routeBasePath>/<versionPath>
     * @see {@link DocMetadata.slug}
     */
    slug?: string;
    /** Customizes the sidebar label for this doc. Will default to its title. */
    sidebar_label?: string;
    /**
     * Controls the position of a doc inside the generated sidebar slice when
     * using autogenerated sidebar items.
     *
     * @see https://docusaurus.io/docs/sidebar#autogenerated-sidebar-metadata
     */
    sidebar_position?: number;
    /**
     * Gives the corresponding sidebar label a special class name when using
     * autogenerated sidebars.
     */
    sidebar_class_name?: string;
    /**
     * Will be propagated to the final sidebars data structure. Useful if you
     * have swizzled sidebar-related code or simply querying doc data through
     * sidebars.
     */
    sidebar_custom_props?: {[key: string]: unknown};
    /**
     * Changes the sidebar association of the current doc. Use `null` to make
     * the current doc not associated to any sidebar.
     */
    displayed_sidebar?: string | null;
    /**
     * Customizes the pagination label for this doc. Will default to the sidebar
     * label.
     */
    pagination_label?: string;
    /** Overrides the default URL computed for this doc. */
    custom_edit_url?: string | null;
    /**
     * Whether number prefix parsing is disabled on this doc.
     * @see https://docusaurus.io/docs/sidebar#using-number-prefixes
     */
    parse_number_prefixes?: boolean;
    /**
     * Minimum TOC heading level. Must be between 2 and 6 and lower or equal to
     * the max value.
     */
    toc_min_heading_level?: number;
    /** Maximum TOC heading level. Must be between 2 and 6. */
    toc_max_heading_level?: number;
    /**
     * The ID of the documentation you want the "Next" pagination to link to.
     * Use `null` to disable showing "Next" for this page.
     * @see {@link DocMetadata.next}
     */
    pagination_next?: string | null;
    /**
     * The ID of the documentation you want the "Previous" pagination to link
     * to. Use `null` to disable showing "Previous" for this page.
     * @see {@link DocMetadata.prev}
     */
    pagination_prev?: string | null;
    /** Should this doc be excluded from production builds? */
    draft?: boolean;
    /** Allows overriding the last updated author and/or date. */
    last_update?: FileChange;
  };

  export type LastUpdateData = {
    /** A timestamp in **seconds**, directly acquired from `git log`. */
    lastUpdatedAt?: number;
    /** `lastUpdatedAt` formatted as a date according to the current locale. */
    formattedLastUpdatedAt?: string;
    /** The author's name directly acquired from `git log`. */
    lastUpdatedBy?: string;
  };

  export type DocMetadataBase = LastUpdateData & {
    // TODO
    /**
     * Legacy versioned ID. Will be refactored in the future to be unversioned.
     */
    id: string;
    // TODO
    /**
     * Unversioned ID. Should be preferred everywhere over `id` until the latter
     * is refactored.
     */
    unversionedId: string;
    /** The name of the version this doc belongs to. */
    version: string;
    /**
     * Used to generate the page h1 heading, tab title, and pagination title.
     */
    title: string;
    /**
     * Description used in the meta. Could be an empty string (empty content)
     */
    description: string;
    /** Path to the Markdown source, with `@site` alias. */
    source: string;
    /**
     * Posix path relative to the content path. Can be `"."`.
     * e.g. "folder/subfolder/subsubfolder"
     */
    sourceDirName: string;
    /** `permalink` without base URL or version path. */
    slug: string;
    /** Full URL to this doc, with base URL and version path. */
    permalink: string;
    /**
     * Draft docs will be excluded for production environment.
     */
    draft: boolean;
    /**
     * Position in an autogenerated sidebar slice, acquired through front matter
     * or number prefix.
     */
    sidebarPosition?: number;
    /**
     * Acquired from the options; can be customized with front matter.
     * `custom_edit_url` will always lead to it being null, but you should treat
     * `undefined` and `null` as equivalent.
     */
    editUrl?: string | null;
    /** Tags, normalized. */
    tags: Tag[];
    /** Front matter, as-is. */
    frontMatter: DocFrontMatter & {[key: string]: unknown};
  };

  export type DocMetadata = DocMetadataBase &
    PropNavigation & {
      /** Name of the sidebar this doc is associated with. */
      sidebar?: string;
    };

  export type CategoryGeneratedIndexMetadata = Required<
    Omit<
      import('./sidebars/types').SidebarItemCategoryLinkGeneratedIndex,
      'type'
    >,
    'title'
  > & {
    navigation: PropNavigation;
    /**
     * Name of the sidebar this doc is associated with. Unlike
     * `DocMetadata.sidebar`, this will always be defined, because a generated
     * index can only be generated from a category.
     */
    sidebar: string;
  };

  export type PropNavigationLink = {
    readonly title: string;
    readonly permalink: string;
  };
  export type PropNavigation = {
    /**
     * Used in pagination. Content is just a subset of another doc's metadata.
     */
    readonly previous?: PropNavigationLink;
    /**
     * Used in pagination. Content is just a subset of another doc's metadata.
     */
    readonly next?: PropNavigationLink;
  };

  export type PropVersionDoc = Pick<
    DocMetadata,
    'id' | 'title' | 'description' | 'sidebar'
  >;

  export type PropVersionDocs = {
    [docId: string]: PropVersionDoc;
  };

  export type PropDocContent = LoadedMDXContent<
    DocFrontMatter,
    DocMetadata,
    Assets
  >;

  export type PropVersionMetadata = Pick<
    VersionMetadata,
    'label' | 'banner' | 'badge' | 'className' | 'isLast' | 'noIndex'
  > & {
    /** ID of the docs plugin this version belongs to. */
    pluginId: string;
    /** Name of this version. */
    version: string;
    /** Sidebars contained in this version. */
    docsSidebars: PropSidebars;
    /** Docs contained in this version. */
    docs: PropVersionDocs;
  };

  export type PropCategoryGeneratedIndex = Omit<
    CategoryGeneratedIndexMetadata,
    'sidebar'
  >;

  export type PropSidebarItemLink =
    import('./sidebars/types').PropSidebarItemLink;
  export type PropSidebarItemHtml =
    import('./sidebars/types').PropSidebarItemHtml;
  export type PropSidebarItemCategory =
    import('./sidebars/types').PropSidebarItemCategory;
  export type PropSidebarItem = import('./sidebars/types').PropSidebarItem;
  export type PropSidebarBreadcrumbsItem =
    import('./sidebars/types').PropSidebarBreadcrumbsItem;
  export type PropSidebar = import('./sidebars/types').PropSidebar;
  export type PropSidebars = import('./sidebars/types').PropSidebars;

  export type PropTagDocListDoc = Pick<
    DocMetadata,
    'id' | 'title' | 'description' | 'permalink'
  >;
  export type PropTagDocList = TagModule & {items: PropTagDocListDoc[]};

  export type PropTagsListPage = {
    tags: TagsListItem[];
  };

  export type LoadedVersion = VersionMetadata & {
    docs: DocMetadata[];
    drafts: DocMetadata[];
    sidebars: import('./sidebars/types').Sidebars;
  };

  export type LoadedContent = {
    loadedVersions: LoadedVersion[];
  };

  export default function pluginContentDocs(
    context: LoadContext,
    options: PluginOptions,
  ): Promise<Plugin<LoadedContent>>;
}

declare module '@theme/DocItem' {
  import type {PropDocContent} from '@docusaurus/plugin-content-docs';

  export type DocumentRoute = {
    readonly component: () => JSX.Element;
    readonly exact: boolean;
    readonly path: string;
    readonly sidebar?: string;
  };

  export interface Props {
    readonly route: DocumentRoute;
    readonly content: PropDocContent;
  }

  export default function DocItem(props: Props): JSX.Element;
}

declare module '@theme/DocCategoryGeneratedIndexPage' {
  import type {PropCategoryGeneratedIndex} from '@docusaurus/plugin-content-docs';

  export interface Props {
    readonly categoryGeneratedIndex: PropCategoryGeneratedIndex;
  }

  export default function DocCategoryGeneratedIndexPage(
    props: Props,
  ): JSX.Element;
}

declare module '@theme/DocTagsListPage' {
  import type {PropTagsListPage} from '@docusaurus/plugin-content-docs';

  export interface Props extends PropTagsListPage {}
  export default function DocTagsListPage(props: Props): JSX.Element;
}

declare module '@theme/DocTagDocListPage' {
  import type {PropTagDocList} from '@docusaurus/plugin-content-docs';

  export interface Props {
    readonly tag: PropTagDocList;
  }
  export default function DocTagDocListPage(props: Props): JSX.Element;
}

declare module '@theme/DocBreadcrumbs' {
  export default function DocBreadcrumbs(): JSX.Element;
}

declare module '@theme/DocsRoot' {
  import type {RouteConfigComponentProps} from 'react-router-config';
  import type {Required} from 'utility-types';

  export interface Props extends Required<RouteConfigComponentProps, 'route'> {}

  export default function DocsRoot(props: Props): JSX.Element;
}

declare module '@theme/DocVersionRoot' {
  import type {PropVersionMetadata} from '@docusaurus/plugin-content-docs';
  import type {RouteConfigComponentProps} from 'react-router-config';
  import type {Required} from 'utility-types';

  export interface Props extends Required<RouteConfigComponentProps, 'route'> {
    readonly version: PropVersionMetadata;
  }

  export default function DocVersionRoot(props: Props): JSX.Element;
}

declare module '@theme/DocRoot' {
  import type {RouteConfigComponentProps} from 'react-router-config';
  import type {Required} from 'utility-types';

  export interface Props extends Required<RouteConfigComponentProps, 'route'> {}

  export default function DocRoot(props: Props): JSX.Element;
}
