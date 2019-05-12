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
  const {frontMatter = {}, excerpt} = parse(fileString);

  // Default id is the file name.
  if (!frontMatter.id) {
    frontMatter.id = path.basename(source, path.extname(source));
  }
  if (frontMatter.id.includes('/')) {
    throw new Error('Document id cannot include "/".');
  }

  // Default title is the id.
  if (!frontMatter.title) {
    frontMatter.title = frontMatter.id;
  }

  if (!frontMatter.description) {
    frontMatter.description = excerpt;
  }

  const dirName = path.dirname(source);
  if (dirName !== '.') {
    const prefix = dirName;
    if (prefix) {
      frontMatter.id = `${prefix}/${frontMatter.id}`;
    }
  }

  // The docs absolute file source.
  // e.g: `/end/docs/hello.md` or `/end/website/versioned_docs/version-1.0.0/hello.md`
  frontMatter.source = path.join(refDir, source);

  // Build the permalink.
  const {baseUrl} = siteConfig;

  // If user has own custom permalink defined in frontmatter
  // e.g: :baseUrl:docsUrl/:langPart/:versionPart/endiliey/:id
  if (frontMatter.permalink) {
    frontMatter.permalink = path.resolve(
      frontMatter.permalink
        .replace(/:baseUrl/, baseUrl)
        .replace(/:docsUrl/, docsBasePath)
        .replace(/:id/, frontMatter.id),
    );
  } else {
    frontMatter.permalink = normalizeUrl([
      baseUrl,
      docsBasePath,
      frontMatter.id,
    ]);
  }

  // Determine order.
  const {id} = frontMatter;
  if (order[id]) {
    frontMatter.sidebar = order[id].sidebar;
    frontMatter.category = order[id].category;
    frontMatter.subCategory = order[id].subCategory;
    if (order[id].next) {
      frontMatter.next = order[id].next;
    }
    if (order[id].previous) {
      frontMatter.previous = order[id].previous;
    }
  }

  return frontMatter;
};
