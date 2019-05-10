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

  // Extract content of markdown (without frontmatter).
  let {content} = matter(fileString);

  // Truncate content if requested (e.g: file.md?truncated=true)
  const {truncated} = this.resourceQuery && parseQuery(this.resourceQuery);
  if (truncated) {
    if (TRUNCATE_MARKER.test(content)) {
      // eslint-disable-next-line
      content = content.split(TRUNCATE_MARKER)[0];
    } else {
      // Return first 4 lines of the content as summary
      content = content
        .split('\n')
        .slice(0, 4)
        .join('\n');
    }
  }
  return callback(null, content);
};
