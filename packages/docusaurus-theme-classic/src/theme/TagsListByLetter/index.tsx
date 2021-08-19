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

import styles from './styles.module.css';

function TagLetterEntryItem({letterEntry}: {letterEntry: TagLetterEntry}) {
  return (
    <article>
      <h2>{letterEntry.letter}</h2>
      <ul className={styles.tags}>
        {letterEntry.tags.map((tag) => (
          <li key={tag.permalink} className={styles.tag}>
            <Link href={tag.permalink}>
              {tag.name} <span>{tag.count}</span>
            </Link>
          </li>
        ))}
      </ul>
      <hr />
    </article>
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
