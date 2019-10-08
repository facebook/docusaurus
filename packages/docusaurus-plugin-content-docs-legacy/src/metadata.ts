/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import path from 'path';
import {parse, normalizeUrl} from '@docusaurus/utils';
import {Order, MetadataRaw} from './types';
import {DocusaurusConfig} from '@docusaurus/types';

export default async function processMetadata(
  source: string,
  docsDir: string,
  order: Order,
  siteConfig: Partial<DocusaurusConfig>,
  docsBasePath: string,
  siteDir: string,
): Promise<MetadataRaw> {
  const filepath = path.join(docsDir, source);

  const fileString = await fs.readFile(filepath, 'utf-8');
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
  const aliasedPath = `@site/${path.relative(siteDir, filepath)}`;
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

  return metadata as MetadataRaw;
}
