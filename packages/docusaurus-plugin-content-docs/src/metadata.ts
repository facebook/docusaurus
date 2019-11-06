/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import path from 'path';
import {parse, normalizeUrl, posixPath} from '@docusaurus/utils';
import {DocusaurusConfig} from '@docusaurus/types';

import lastUpdate from './lastUpdate';
import {Order, MetadataRaw} from './types';

type Args = {
  source: string;
  refDir: string;
  order: Order;
  siteConfig: Partial<DocusaurusConfig>;
  docsBasePath: string;
  siteDir: string;
  editUrl?: string;
  showLastUpdateAuthor?: boolean;
  showLastUpdateTime?: boolean;
};

export default async function processMetadata({
  source,
  refDir,
  order,
  siteConfig,
  docsBasePath,
  siteDir,
  editUrl,
  showLastUpdateAuthor,
  showLastUpdateTime,
}: Args): Promise<MetadataRaw> {
  const filePath = path.join(refDir, source);

  const fileString = await fs.readFile(filePath, 'utf-8');
  const {frontMatter: metadata = {}, excerpt} = parse(fileString);

  // Default id is the file name.
  if (!metadata.id) {
    metadata.id = path.basename(source, path.extname(source));
  }

  if (metadata.id.includes('/')) {
    throw new Error('Document id cannot include "/".');
  }

  // Default title is the id.
  if (!metadata.title) {
    metadata.title = metadata.id;
  }

  if (!metadata.description) {
    metadata.description = excerpt;
  }

  const dirName = path.dirname(source);
  if (dirName !== '.') {
    const prefix = dirName;
    if (prefix) {
      metadata.id = `${prefix}/${metadata.id}`;
    }
  }

  // Cannot use path.join() as it resolves '../' and removes the '@site'. Let webpack loader resolve it.
  const aliasedPath = `@site/${path.relative(siteDir, filePath)}`;
  metadata.source = aliasedPath;

  // Build the permalink.
  const {baseUrl} = siteConfig;

  // If user has own custom permalink defined in frontmatter
  // e.g: :baseUrl:docsUrl/:langPart/:versionPart/endiliey/:id
  if (metadata.permalink) {
    metadata.permalink = path.resolve(
      metadata.permalink
        .replace(/:baseUrl/, baseUrl)
        .replace(/:docsUrl/, docsBasePath)
        .replace(/:id/, metadata.id),
    );
  } else {
    metadata.permalink = normalizeUrl([baseUrl, docsBasePath, metadata.id]);
  }

  // Determine order.
  const {id} = metadata;
  if (order[id]) {
    metadata.sidebar = order[id].sidebar;
    if (order[id].next) {
      metadata.next = order[id].next;
    }
    if (order[id].previous) {
      metadata.previous = order[id].previous;
    }
  }

  if (editUrl) {
    metadata.editUrl = normalizeUrl([
      editUrl,
      posixPath(path.relative(siteDir, filePath)),
    ]);
  }

  if (metadata.custom_edit_url) {
    metadata.editUrl = metadata.custom_edit_url;
    delete metadata.custom_edit_url;
  }

  if (showLastUpdateAuthor || showLastUpdateTime) {
    // Use fake data in dev for faster development
    const fileLastUpdateData =
      process.env.NODE_ENV === 'production'
        ? await lastUpdate(filePath)
        : {
            author: 'Author',
            timestamp: '1539502055',
          };

    if (fileLastUpdateData) {
      const {author, timestamp} = fileLastUpdateData;
      if (showLastUpdateAuthor && author) {
        metadata.lastUpdatedBy = author;
      }

      if (showLastUpdateTime && timestamp) {
        metadata.lastUpdatedAt = timestamp;
      }
    }
  }

  return metadata as MetadataRaw;
}
