/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const Remarkable = require('remarkable');
const mdToc = require('markdown-toc');
const toSlug = require('./toSlug');

const tagToLevel = tag => Number(tag.slice(1));

/**
 * Returns a table of content from the headings
 *
 * @return array
 * Array of heading objects with `hashLink`, `content` and `children` fields
 *
 */
module.exports = (content, headingTags = 'h2', subHeadingTags = 'h3') => {
  const headingLevels = [].concat(headingTags).map(tagToLevel);
  const subHeadingLevels = subHeadingTags
    ? [].concat(subHeadingTags).map(tagToLevel)
    : [];

  const md = new Remarkable();
  const headings = mdToc(content, {
    filter: function(str, ele) {
      return headingLevels.concat(subHeadingLevels).includes(ele.lvl);
    },
  }).json;

  const toc = [];
  let current;
  headings.forEach(heading => {
    const entry = {
      hashLink: toSlug(heading.content),
      content: md.renderInline(mdToc.titleize(heading.content)),
      children: [],
    };

    if (headingLevels.includes(heading.lvl)) {
      toc.push(entry);
      current = entry;
    } else {
      current && current.children.push(entry);
    }
  });

  return toc;
};
