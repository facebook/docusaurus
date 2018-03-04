/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const Remarkable = require('remarkable');
const toSlug = require('./toSlug');

const tagToLevel = tag => Number(tag.slice(1));

/**
 * Returns a table of content from the headings
 *
 * @return array
 * Array of heading objects with `hashLink`, `text` and `children` fields
 *
 */
module.exports = (content, headingTags = 'h2', subHeadingTags = 'h3') => {
  const headingLevels = [].concat(headingTags).map(tagToLevel);
  const subHeadingLevels = subHeadingTags
    ? [].concat(subHeadingTags).map(tagToLevel)
    : [];

  const md = new Remarkable();
  const tokens = md.parse(content, {});
  const headings = [];
  for (let i = 0; i < tokens.length; i++) {
    if (
      tokens[i].type == 'heading_open' &&
      headingLevels.concat(subHeadingLevels).includes(tokens[i].hLevel)
    ) {
      headings.push({
        hLevel: tokens[i].hLevel,
        text: tokens[i + 1].content,
      });
    }
  }

  const toc = [];
  let current;
  headings.forEach(heading => {
    const entry = {
      hashLink: toSlug(heading.text),
      text: heading.text,
      children: [],
    };

    if (headingLevels.includes(heading.hLevel)) {
      toc.push(entry);
      current = entry;
    } else {
      current && current.children.push(entry);
    }
  });

  return toc;
};
