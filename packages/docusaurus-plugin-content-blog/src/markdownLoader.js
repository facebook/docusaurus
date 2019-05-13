/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const matter = require('gray-matter');
const {parseQuery} = require('loader-utils');

const TRUNCATE_MARKER = /<!--\s*truncate\s*-->/;

module.exports = async function(fileString) {
  const callback = this.async();

  let finalContent = fileString;

  // Truncate content if requested (e.g: file.md?truncated=true)
  const {truncated} = this.resourceQuery && parseQuery(this.resourceQuery);
  if (truncated) {
    if (TRUNCATE_MARKER.test(fileString)) {
      // eslint-disable-next-line
      finalContent = fileString.split(TRUNCATE_MARKER)[0];
    } else {
      // Only use the first 4 lines of the content (not the frontmatter)
      const {data, content} = matter(fileString);
      const truncatedContent = content
        .trim()
        .split('\n', 4)
        .join('\n');
      finalContent = matter.stringify(truncatedContent, data);
    }
  }
  return callback(null, finalContent);
};
