/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import path from 'path';
import {parse, normalizeUrl, posixPath} from '@docusaurus/utils';
import {LoadContext} from '@docusaurus/types';

import lastUpdate from './lastUpdate';
import {MetadataRaw, LastUpdateData} from './types';

type Args = {
  source: string;
  refDir: string;
  context: LoadContext;
  docsBasePath: string;
  editUrl?: string;
  showLastUpdateAuthor?: boolean;
  showLastUpdateTime?: boolean;
};

async function getLastUpdated(
  filePath: string,
  showLastUpdateAuthor?: boolean,
  showLastUpdateTime?: boolean,
): Promise<LastUpdateData> {
  if (showLastUpdateAuthor || showLastUpdateTime) {
    // Use fake data in dev for faster development
    const fileLastUpdateData =
      process.env.NODE_ENV === 'production'
        ? await lastUpdate(filePath)
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

export default async function processMetadata({
  source,
  refDir,
  context,
  docsBasePath,
  editUrl,
  showLastUpdateAuthor,
  showLastUpdateTime,
}: Args): Promise<MetadataRaw> {
  const {siteDir, baseUrl} = context;
  const filePath = path.join(refDir, source);

  const fileString = await fs.readFile(filePath, 'utf-8');
  const {frontMatter = {}, excerpt} = parse(fileString);

  // Default id is the file name.
  const baseID: string =
    frontMatter.id || path.basename(source, path.extname(source));
  if (baseID.includes('/')) {
    throw new Error('Document id cannot include "/".');
  }

  // Default title is the id.
  const title: string = frontMatter.title || baseID;

  const description: string = frontMatter.description || excerpt;

  let id = baseID;
  const dirName = path.dirname(source);
  if (dirName !== '.') {
    const prefix = dirName;
    if (prefix) {
      id = `${prefix}/${baseID}`;
    }
  }

  const {sidebar_label, hide_title, custom_edit_url} = frontMatter;

  const relativePath = path.relative(siteDir, filePath);

  // Cannot use path.join() as it resolves '../' and removes the '@site'. Let webpack loader resolve it.
  const aliasedPath = `@site/${relativePath}`;

  const permalink = normalizeUrl([baseUrl, docsBasePath, id]);

  const docsEditUrl = editUrl
    ? normalizeUrl([editUrl, posixPath(relativePath)])
    : undefined;

  const {lastUpdatedAt, lastUpdatedBy} = await getLastUpdated(
    filePath,
    showLastUpdateAuthor,
    showLastUpdateTime,
  );

  // Assign all of object properties during instantiation (if possible) for NodeJS optimization
  // Adding properties to object after instantiation will cause hidden class transitions.

  const metadata: MetadataRaw = {
    id,
    title,
    description,
    source: aliasedPath,
    permalink,
    sidebar_label,
    hide_title,
    editUrl: custom_edit_url || docsEditUrl,
    lastUpdatedBy,
    lastUpdatedAt,
  };

  return metadata;
}
