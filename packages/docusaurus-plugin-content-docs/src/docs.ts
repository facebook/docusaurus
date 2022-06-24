/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import fs from 'fs-extra';
import logger from '@docusaurus/logger';
import {
  aliasedSitePath,
  getEditUrl,
  getFolderContainingFile,
  getContentPathList,
  normalizeUrl,
  parseMarkdownString,
  posixPath,
  Globby,
  normalizeFrontMatterTags,
} from '@docusaurus/utils';

import {getFileLastUpdate} from './lastUpdate';
import getSlug from './slug';
import {CURRENT_VERSION_NAME} from './constants';
import {stripPathNumberPrefixes} from './numberPrefix';
import {validateDocFrontMatter} from './frontMatter';
import {toDocNavigationLink, toNavigationLink} from './sidebars/utils';
import type {
  MetadataOptions,
  PluginOptions,
  CategoryIndexMatcher,
  DocMetadataBase,
  DocMetadata,
  PropNavigationLink,
  LastUpdateData,
  VersionMetadata,
  DocFrontMatter,
  LoadedVersion,
  FileChange,
} from '@docusaurus/plugin-content-docs';
import type {LoadContext} from '@docusaurus/types';
import type {SidebarsUtils} from './sidebars/utils';
import type {DocFile} from './types';

type LastUpdateOptions = Pick<
  PluginOptions,
  'showLastUpdateAuthor' | 'showLastUpdateTime'
>;

async function readLastUpdateData(
  filePath: string,
  options: LastUpdateOptions,
  lastUpdateFrontMatter: FileChange | undefined,
): Promise<LastUpdateData> {
  const {showLastUpdateAuthor, showLastUpdateTime} = options;
  if (showLastUpdateAuthor || showLastUpdateTime) {
    const frontMatterTimestamp = lastUpdateFrontMatter?.date
      ? new Date(lastUpdateFrontMatter.date).getTime() / 1000
      : undefined;

    if (lastUpdateFrontMatter?.author && lastUpdateFrontMatter.date) {
      return {
        lastUpdatedAt: frontMatterTimestamp,
        lastUpdatedBy: lastUpdateFrontMatter.author,
      };
    }

    // Use fake data in dev for faster development.
    const fileLastUpdateData =
      process.env.NODE_ENV === 'production'
        ? await getFileLastUpdate(filePath)
        : {
            author: 'Author',
            timestamp: 1539502055,
          };
    const {author, timestamp} = fileLastUpdateData ?? {};

    return {
      lastUpdatedBy: showLastUpdateAuthor
        ? lastUpdateFrontMatter?.author ?? author
        : undefined,
      lastUpdatedAt: showLastUpdateTime
        ? frontMatterTimestamp ?? timestamp
        : undefined,
    };
  }

  return {};
}

export async function readDocFile(
  versionMetadata: Pick<
    VersionMetadata,
    'contentPath' | 'contentPathLocalized'
  >,
  source: string,
): Promise<DocFile> {
  const contentPath = await getFolderContainingFile(
    getContentPathList(versionMetadata),
    source,
  );

  const filePath = path.join(contentPath, source);

  const content = await fs.readFile(filePath, 'utf-8');
  return {source, content, contentPath, filePath};
}

export async function readVersionDocs(
  versionMetadata: VersionMetadata,
  options: Pick<
    PluginOptions,
    'include' | 'exclude' | 'showLastUpdateAuthor' | 'showLastUpdateTime'
  >,
): Promise<DocFile[]> {
  const sources = await Globby(options.include, {
    cwd: versionMetadata.contentPath,
    ignore: options.exclude,
  });
  return Promise.all(
    sources.map((source) => readDocFile(versionMetadata, source)),
  );
}

export type DocEnv = 'production' | 'development';

/** Docs with draft front matter are only considered draft in production. */
function isDraftForEnvironment({
  env,
  frontMatter,
}: {
  frontMatter: DocFrontMatter;
  env: DocEnv;
}): boolean {
  return (env === 'production' && frontMatter.draft) ?? false;
}

async function doProcessDocMetadata({
  docFile,
  versionMetadata,
  context,
  options,
  env,
}: {
  docFile: DocFile;
  versionMetadata: VersionMetadata;
  context: LoadContext;
  options: MetadataOptions;
  env: DocEnv;
}): Promise<DocMetadataBase> {
  const {source, content, contentPath, filePath} = docFile;
  const {siteDir, i18n} = context;

  const {
    frontMatter: unsafeFrontMatter,
    contentTitle,
    excerpt,
  } = parseMarkdownString(content);
  const frontMatter = validateDocFrontMatter(unsafeFrontMatter);

  const {
    custom_edit_url: customEditURL,

    // Strip number prefixes by default
    // (01-MyFolder/01-MyDoc.md => MyFolder/MyDoc)
    // but allow to disable this behavior with front matter
    parse_number_prefixes: parseNumberPrefixes = true,
    last_update: lastUpdateFrontMatter,
  } = frontMatter;

  const lastUpdate = await readLastUpdateData(
    filePath,
    options,
    lastUpdateFrontMatter,
  );

  // E.g. api/plugins/myDoc -> myDoc; myDoc -> myDoc
  const sourceFileNameWithoutExtension = path.basename(
    source,
    path.extname(source),
  );

  // E.g. api/plugins/myDoc -> api/plugins; myDoc -> .
  const sourceDirName = path.dirname(source);

  const {filename: unprefixedFileName, numberPrefix} = parseNumberPrefixes
    ? options.numberPrefixParser(sourceFileNameWithoutExtension)
    : {filename: sourceFileNameWithoutExtension, numberPrefix: undefined};

  const baseID: string = frontMatter.id ?? unprefixedFileName;
  if (baseID.includes('/')) {
    throw new Error(`Document id "${baseID}" cannot include slash.`);
  }

  // For autogenerated sidebars, sidebar position can come from filename number
  // prefix or front matter
  const sidebarPosition: number | undefined =
    frontMatter.sidebar_position ?? numberPrefix;

  // TODO legacy retrocompatibility
  // The same doc in 2 distinct version could keep the same id,
  // we just need to namespace the data by version
  const versionIdPrefix =
    versionMetadata.versionName === CURRENT_VERSION_NAME
      ? undefined
      : `version-${versionMetadata.versionName}`;

  // TODO legacy retrocompatibility
  // I think it's bad to affect the front matter id with the dirname?
  function computeDirNameIdPrefix() {
    if (sourceDirName === '.') {
      return undefined;
    }
    // Eventually remove the number prefixes from intermediate directories
    return parseNumberPrefixes
      ? stripPathNumberPrefixes(sourceDirName, options.numberPrefixParser)
      : sourceDirName;
  }

  const unversionedId = [computeDirNameIdPrefix(), baseID]
    .filter(Boolean)
    .join('/');

  // TODO is versioning the id very useful in practice?
  // legacy versioned id, requires a breaking change to modify this
  const id = [versionIdPrefix, unversionedId].filter(Boolean).join('/');

  const docSlug = getSlug({
    baseID,
    source,
    sourceDirName,
    frontMatterSlug: frontMatter.slug,
    stripDirNumberPrefixes: parseNumberPrefixes,
    numberPrefixParser: options.numberPrefixParser,
  });

  // Note: the title is used by default for page title, sidebar label,
  // pagination buttons... frontMatter.title should be used in priority over
  // contentTitle (because it can contain markdown/JSX syntax)
  const title: string = frontMatter.title ?? contentTitle ?? baseID;

  const description: string = frontMatter.description ?? excerpt ?? '';

  const permalink = normalizeUrl([versionMetadata.path, docSlug]);

  function getDocEditUrl() {
    const relativeFilePath = path.relative(contentPath, filePath);

    if (typeof options.editUrl === 'function') {
      return options.editUrl({
        version: versionMetadata.versionName,
        versionDocsDirPath: posixPath(
          path.relative(siteDir, versionMetadata.contentPath),
        ),
        docPath: posixPath(relativeFilePath),
        permalink,
        locale: context.i18n.currentLocale,
      });
    } else if (typeof options.editUrl === 'string') {
      const isLocalized = contentPath === versionMetadata.contentPathLocalized;
      const baseVersionEditUrl =
        isLocalized && options.editLocalizedFiles
          ? versionMetadata.editUrlLocalized
          : versionMetadata.editUrl;
      return getEditUrl(relativeFilePath, baseVersionEditUrl);
    }
    return undefined;
  }

  const draft = isDraftForEnvironment({env, frontMatter});

  const formatDate = (locale: string, date: Date, calendar: string): string => {
    try {
      return new Intl.DateTimeFormat(locale, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        timeZone: 'UTC',
        calendar,
      }).format(date);
    } catch (err) {
      logger.error`Can't format docs lastUpdatedAt date "${String(date)}"`;
      throw err;
    }
  };

  // Assign all of object properties during instantiation (if possible) for
  // NodeJS optimization.
  // Adding properties to object after instantiation will cause hidden
  // class transitions.
  return {
    unversionedId,
    id,
    title,
    description,
    source: aliasedSitePath(filePath, siteDir),
    sourceDirName,
    slug: docSlug,
    permalink,
    draft,
    editUrl: customEditURL !== undefined ? customEditURL : getDocEditUrl(),
    tags: normalizeFrontMatterTags(versionMetadata.tagsPath, frontMatter.tags),
    version: versionMetadata.versionName,
    lastUpdatedBy: lastUpdate.lastUpdatedBy,
    lastUpdatedAt: lastUpdate.lastUpdatedAt,
    formattedLastUpdatedAt: lastUpdate.lastUpdatedAt
      ? formatDate(
          i18n.currentLocale,
          new Date(lastUpdate.lastUpdatedAt * 1000),
          i18n.localeConfigs[i18n.currentLocale]!.calendar,
        )
      : undefined,
    sidebarPosition,
    frontMatter,
  };
}

export function processDocMetadata(args: {
  docFile: DocFile;
  versionMetadata: VersionMetadata;
  context: LoadContext;
  options: MetadataOptions;
  env: DocEnv;
}): Promise<DocMetadataBase> {
  try {
    return doProcessDocMetadata(args);
  } catch (err) {
    logger.error`Can't process doc metadata for doc at path path=${args.docFile.filePath} in version name=${args.versionMetadata.versionName}`;
    throw err;
  }
}

export function addDocNavigation(
  docsBase: DocMetadataBase[],
  sidebarsUtils: SidebarsUtils,
  sidebarFilePath: string,
): LoadedVersion['docs'] {
  const docsById = createDocsByIdIndex(docsBase);

  sidebarsUtils.checkSidebarsDocIds(
    docsBase.flatMap(getDocIds),
    sidebarFilePath,
  );

  // Add sidebar/next/previous to the docs
  function addNavData(doc: DocMetadataBase): DocMetadata {
    const navigation = sidebarsUtils.getDocNavigation(
      doc.unversionedId,
      doc.id,
      doc.frontMatter.displayed_sidebar,
    );

    const toNavigationLinkByDocId = (
      docId: string | null | undefined,
      type: 'prev' | 'next',
    ): PropNavigationLink | undefined => {
      if (!docId) {
        return undefined;
      }
      const navDoc = docsById[docId];
      if (!navDoc) {
        // This could only happen if user provided the ID through front matter
        throw new Error(
          `Error when loading ${doc.id} in ${doc.sourceDirName}: the pagination_${type} front matter points to a non-existent ID ${docId}.`,
        );
      }
      return toDocNavigationLink(navDoc);
    };

    const previous =
      doc.frontMatter.pagination_prev !== undefined
        ? toNavigationLinkByDocId(doc.frontMatter.pagination_prev, 'prev')
        : toNavigationLink(navigation.previous, docsById);
    const next =
      doc.frontMatter.pagination_next !== undefined
        ? toNavigationLinkByDocId(doc.frontMatter.pagination_next, 'next')
        : toNavigationLink(navigation.next, docsById);

    return {...doc, sidebar: navigation.sidebarName, previous, next};
  }

  const docsWithNavigation = docsBase.map(addNavData);
  // Sort to ensure consistent output for tests
  docsWithNavigation.sort((a, b) => a.id.localeCompare(b.id));
  return docsWithNavigation;
}

/**
 * The "main doc" is the "version entry point"
 * We browse this doc by clicking on a version:
 * - the "home" doc (at '/docs/')
 * - the first doc of the first sidebar
 * - a random doc (if no docs are in any sidebar... edge case)
 */
export function getMainDocId({
  docs,
  sidebarsUtils,
}: {
  docs: DocMetadataBase[];
  sidebarsUtils: SidebarsUtils;
}): string {
  function getMainDoc(): DocMetadata {
    const versionHomeDoc = docs.find((doc) => doc.slug === '/');
    const firstDocIdOfFirstSidebar =
      sidebarsUtils.getFirstDocIdOfFirstSidebar();
    if (versionHomeDoc) {
      return versionHomeDoc;
    } else if (firstDocIdOfFirstSidebar) {
      return docs.find(
        (doc) =>
          doc.id === firstDocIdOfFirstSidebar ||
          doc.unversionedId === firstDocIdOfFirstSidebar,
      )!;
    }
    return docs[0]!;
  }

  return getMainDoc().unversionedId;
}

// By convention, Docusaurus considers some docs are "indexes":
// - index.md
// - readme.md
// - <folder>/<folder>.md
//
// This function is the default implementation of this convention
//
// Those index docs produce a different behavior
// - Slugs do not end with a weird "/index" suffix
// - Auto-generated sidebar categories link to them as intro
export const isCategoryIndex: CategoryIndexMatcher = ({
  fileName,
  directories,
}): boolean => {
  const eligibleDocIndexNames = [
    'index',
    'readme',
    directories[0]?.toLowerCase(),
  ];
  return eligibleDocIndexNames.includes(fileName.toLowerCase());
};

/**
 * `guides/sidebar/autogenerated.md` ->
 *   `'autogenerated', '.md', ['sidebar', 'guides']`
 */
export function toCategoryIndexMatcherParam({
  source,
  sourceDirName,
}: Pick<
  DocMetadataBase,
  'source' | 'sourceDirName'
>): Parameters<CategoryIndexMatcher>[0] {
  // source + sourceDirName are always posix-style
  return {
    fileName: path.posix.parse(source).name,
    extension: path.posix.parse(source).ext,
    directories: sourceDirName.split(path.posix.sep).reverse(),
  };
}

// Return both doc ids
// TODO legacy retro-compatibility due to old versioned sidebars using
// versioned doc ids ("id" should be removed & "versionedId" should be renamed
// to "id")
export function getDocIds(doc: DocMetadataBase): [string, string] {
  return [doc.unversionedId, doc.id];
}

// Docs are indexed by both versioned and unversioned ids at the same time
// TODO legacy retro-compatibility due to old versioned sidebars using
// versioned doc ids ("id" should be removed & "versionedId" should be renamed
// to "id")
export function createDocsByIdIndex<
  Doc extends {id: string; unversionedId: string},
>(docs: Doc[]): {[docId: string]: Doc} {
  return Object.fromEntries(
    docs.flatMap((doc) => [
      [doc.unversionedId, doc],
      [doc.id, doc],
    ]),
  );
}
