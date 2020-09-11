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
  VersionMetadata,
  DocFile,
  PluginOptions,
} from './types';
import getSlug from './slug';
import {CURRENT_VERSION_NAME} from './constants';
import globby from 'globby';

type LastUpdateOptions = Pick<
  PluginOptions,
  'showLastUpdateAuthor' | 'showLastUpdateTime'
>;

async function readLastUpdateData(
  filePath: string,
  options: LastUpdateOptions,
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

export async function readDocFile(
  docsDirPath: string,
  source: string,
  options: LastUpdateOptions,
): Promise<DocFile> {
  const filePath = path.join(docsDirPath, source);
  const [content, lastUpdate] = await Promise.all([
    fs.readFile(filePath, 'utf-8'),
    readLastUpdateData(filePath, options),
  ]);
  return {source, content, lastUpdate};
}

export async function readVersionDocs(
  versionMetadata: VersionMetadata,
  options: Pick<
    PluginOptions,
    'include' | 'showLastUpdateAuthor' | 'showLastUpdateTime'
  >,
): Promise<DocFile[]> {
  const sources = await globby(options.include, {
    cwd: versionMetadata.docsDirPath,
  });
  return Promise.all(
    sources.map((source) =>
      readDocFile(versionMetadata.docsDirPath, source, options),
    ),
  );
}

export function processDocMetadata({
  docFile,
  versionMetadata,
  context,
  options,
}: {
  docFile: DocFile;
  versionMetadata: VersionMetadata;
  context: LoadContext;
  options: MetadataOptions;
}): DocMetadataBase {
  const {source, content, lastUpdate} = docFile;
  const {editUrl, homePageId} = options;
  const {siteDir} = context;
  const filePath = path.join(versionMetadata.docsDirPath, source);

  // ex: api/myDoc -> api
  // ex: myDoc -> .
  const docsFileDirName = path.dirname(source);

  const docsEditUrl = getEditUrl(path.relative(siteDir, filePath), editUrl);

  const {frontMatter = {}, excerpt} = parseMarkdownString(content);
  const {sidebar_label, custom_edit_url} = frontMatter;

  const baseID: string =
    frontMatter.id || path.basename(source, path.extname(source));
  if (baseID.includes('/')) {
    throw new Error(`Document id [${baseID}] cannot include "/".`);
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

  const unversionedId = `${dirNameIdPart}${baseID}`;

  // TODO remove soon, deprecated homePageId
  const isDocsHomePage = unversionedId === (homePageId ?? '_index');
  if (frontMatter.slug && isDocsHomePage) {
    throw new Error(
      `The docs homepage (homePageId=${homePageId}) is not allowed to have a frontmatter slug=${frontMatter.slug} => you have to choose either homePageId or slug, not both`,
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

  const permalink = normalizeUrl([versionMetadata.versionPath, docSlug]);

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
    version: versionMetadata.versionName,
    lastUpdatedBy: lastUpdate.lastUpdatedBy,
    lastUpdatedAt: lastUpdate.lastUpdatedAt,
    sidebar_label,
  };

  return metadata;
}
