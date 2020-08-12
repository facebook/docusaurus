/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import fs from 'fs-extra';
import {
  aliasedSitePath,
  normalizeUrl,
  getEditUrl,
  parseMarkdownString,
} from '@docusaurus/utils';
import {LoadContext} from '@docusaurus/types';

import {getFileLastUpdate} from './lastUpdate';
import {
  DocMetadataBase,
  LastUpdateData,
  MetadataOptions,
  Env,
  VersionMetadata,
  DocFile,
  PluginOptions,
} from './types';
import getSlug from './slug';
import {CURRENT_VERSION_NAME} from './constants';
import globby from 'globby';

async function readLastUpdateData(
  filePath: string,
  options: Pick<PluginOptions, 'showLastUpdateAuthor' | 'showLastUpdateTime'>,
): Promise<LastUpdateData> {
  const {showLastUpdateAuthor, showLastUpdateTime} = options;
  if (showLastUpdateAuthor || showLastUpdateTime) {
    // Use fake data in dev for faster development.
    const fileLastUpdateData =
      process.env.NODE_ENV === 'production'
        ? await getFileLastUpdate(filePath)
        : {
            author: 'Author',
            timestamp: 1539502055,
          };

    if (fileLastUpdateData) {
      const {author, timestamp} = fileLastUpdateData;
      return {
        lastUpdatedAt: showLastUpdateTime ? timestamp : undefined,
        lastUpdatedBy: showLastUpdateAuthor ? author : undefined,
      };
    }
  }

  return {};
}

export async function readVersionDocs(
  versionMetadata: VersionMetadata,
  options: Pick<
    PluginOptions,
    'include' | 'showLastUpdateAuthor' | 'showLastUpdateTime'
  >,
): Promise<DocFile[]> {
  const sources = await globby(options.include, {
    cwd: versionMetadata.docsPath,
  });

  async function readDoc(source: string): Promise<DocFile> {
    const filePath = path.join(versionMetadata.docsPath, source);
    const [content, lastUpdate] = await Promise.all([
      fs.readFile(filePath, 'utf-8'),
      readLastUpdateData(filePath, options),
    ]);
    return {source, content, lastUpdate};
  }

  return Promise.all(sources.map(readDoc));
}

export function processDocMetadata({
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
  env: Env;
}): DocMetadataBase {
  const {source, content, lastUpdate} = docFile;
  const {routeBasePath, editUrl, homePageId} = options;
  const {siteDir, baseUrl} = context;
  const {versioning} = env;
  const filePath = path.join(versionMetadata.docsPath, source);

  // ex: api/myDoc -> api
  // ex: myDoc -> .
  const docsFileDirName = path.dirname(source);

  const {versionName} = versionMetadata;

  // TODO for legacy compatibility
  function getVersionPath() {
    if (!versioning.enabled || versionName === versioning.latestVersion) {
      return '';
    }
    if (versionName === CURRENT_VERSION_NAME) {
      return 'next';
    }
    return versionName;
  }

  // The version portion of the url path. Eg: 'next', '1.0.0', and ''.
  const versionPath = getVersionPath();

  const docsEditUrl = getEditUrl(path.relative(siteDir, filePath), editUrl);

  const {frontMatter = {}, excerpt} = parseMarkdownString(content);
  const {sidebar_label, custom_edit_url} = frontMatter;

  const baseID: string =
    frontMatter.id || path.basename(source, path.extname(source));
  if (baseID.includes('/')) {
    throw new Error(`Document id [${baseID}]cannot include "/".`);
  }

  // TODO legacy retrocompatibility
  // The same doc in 2 distinct version could keep the same id,
  // we just need to namespace the data by version
  const versionIdPart =
    versionMetadata.versionName === CURRENT_VERSION_NAME
      ? ''
      : `version-${versionMetadata.versionName}/`;

  // TODO legacy retrocompatibility
  // I think it's bad to affect the frontmatter id with the dirname
  const dirNameIdPart = docsFileDirName === '.' ? '' : `${docsFileDirName}/`;

  // TODO legacy composite id, requires a breaking change to modify this
  const id = `${versionIdPart}${dirNameIdPart}${baseID}`;

  const unversionedId = baseID;

  // TODO remove soon, deprecated homePageId
  const isDocsHomePage = unversionedId === (homePageId ?? '_index');
  if (frontMatter.slug && isDocsHomePage) {
    throw new Error(
      `The docs homepage (homePageId=${homePageId}) is not allowed to have a frontmatter slug=${frontMatter.slug} => you have to chooser either homePageId or slug, not both`,
    );
  }

  const docSlug = isDocsHomePage
    ? '/'
    : getSlug({
        baseID,
        dirName: docsFileDirName,
        frontmatterSlug: frontMatter.slug,
      });

  // Default title is the id.
  const title: string = frontMatter.title || baseID;

  const description: string = frontMatter.description || excerpt;

  const permalink = normalizeUrl([
    baseUrl,
    routeBasePath,
    versionPath,
    docSlug,
  ]);

  // Assign all of object properties during instantiation (if possible) for
  // NodeJS optimization.
  // Adding properties to object after instantiation will cause hidden
  // class transitions.
  const metadata: DocMetadataBase = {
    unversionedId,
    id,
    isDocsHomePage,
    title,
    description,
    source: aliasedSitePath(filePath, siteDir),
    slug: docSlug,
    permalink,
    editUrl: custom_edit_url !== undefined ? custom_edit_url : docsEditUrl,
    version: versionName,
    lastUpdatedBy: lastUpdate.lastUpdatedBy,
    lastUpdatedAt: lastUpdate.lastUpdatedAt,
    sidebar_label,
  };

  return metadata;
}
