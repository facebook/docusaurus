/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import Layout from '@theme/Layout'; // eslint-disable-line
import Link from '@docusaurus/Link';

const CHARS_IN_ALPHABET = 26;
const ASCII_LOWERCASE_A = 97;

function BlogTagsListPage(props) {
  const {tags} = props;

  const tagsList = Array(CHARS_IN_ALPHABET)
    .fill(null)
    .map(() => []);
  const allTags = Object.keys(tags).sort();

  allTags.forEach(tag => {
    const firstLetter = tag.charCodeAt(0);
    tagsList[firstLetter - ASCII_LOWERCASE_A].push(tag);
  });

  const tagsSection = tagsList
    .map((tagsForLetter, index) => {
      if (tagsForLetter.length === 0) {
        return null;
      }
      const letter = String.fromCharCode(
        ASCII_LOWERCASE_A + index,
      ).toUpperCase();

      return (
        <div key={letter}>
          <h3>{letter}</h3>
          {tagsForLetter.map(tag => (
            <Link
              className="padding-right--md"
              href={tags[tag].permalink}
              key="tag">
              {tag} ({tags[tag].count})
            </Link>
          ))}
          <hr />
        </div>
      );
    })
    .filter(item => item != null);

  return (
    <Layout title="Blog Tags" description="Blog Tags">
      <div className="container margin-vert--xl">
        <div className="row">
          <div className="col col--8 col--offset-2">
            <h1>Tags</h1>
            <div className="margin-vert--lg">{tagsSection}</div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default BlogTagsListPage;
