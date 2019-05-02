/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const fs = require('fs-extra');
const path = require('path');
const {parse, normalizeUrl} = require('@docusaurus/utils');

module.exports = async function processMetadata(
  source,
  refDir,
  order,
  siteConfig,
  docsBasePath,
) {
  const filepath = path.resolve(refDir, source);
  const fileString = await fs.readFile(filepath, 'utf-8');
  const {metadata} = parse(fileString);

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

  const dirName = path.dirname(source);
  if (dirName !== '.') {
    const prefix = dirName;
    if (prefix) {
      metadata.id = `${prefix}/${metadata.id}`;
    }
  }

  // The docs absolute file source.
  // e.g: `/end/docs/hello.md` or `/end/website/versioned_docs/version-1.0.0/hello.md`
  metadata.source = path.join(refDir, source);

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
    metadata.category = order[id].category;
    metadata.subCategory = order[id].subCategory;
    if (order[id].next) {
      metadata.next = order[id].next;
    }
    if (order[id].previous) {
      metadata.previous = order[id].previous;
    }
  }

  return metadata;
};
