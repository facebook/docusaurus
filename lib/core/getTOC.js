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
  const allowedHeadingLevels = headingLevels.concat(subHeadingLevels);

  const md = new Remarkable();
  const headings = mdToc(content).json;

  const toc = [];
  const context = {};
  let current;

  headings.forEach(heading => {
    // we need always generate slugs to ensure, that we will have consistent
    // slug indexes for headings with the same names
    const hashLink = toSlug(heading.content, context);

    if (!allowedHeadingLevels.includes(heading.lvl)) {
      return;
    }

    const rawContent = mdToc.titleize(heading.content);
    const entry = {
      hashLink,
      rawContent,
      content: md.renderInline(rawContent),
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
