/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Link from '@docusaurus/Link';
import type {Props} from '@theme/TagsListByLetter';
import {listTagsByLetters, TagLetterEntry} from '@docusaurus/theme-common';

function TagLetterEntryItem({letterEntry}: {letterEntry: TagLetterEntry}) {
  return (
    <div>
      <h2>{letterEntry.letter}</h2>
      {letterEntry.tags.map((tag) => (
        <Link
          className="padding-right--md"
          href={tag.permalink}
          key={tag.permalink}>
          {tag.name} ({tag.count})
        </Link>
      ))}
      <hr />
    </div>
  );
}

function TagsListByLetter({tags}: Props): JSX.Element {
  const letterList = listTagsByLetters(tags);
  return (
    <section className="margin-vert--lg">
      {letterList.map((letterEntry) => (
        <TagLetterEntryItem
          key={letterEntry.letter}
          letterEntry={letterEntry}
        />
      ))}
    </section>
  );
}

export default TagsListByLetter;
