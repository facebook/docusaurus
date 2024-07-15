/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import {type LetterEntry} from '@docusaurus/theme-common';
import {listAuthorsByLetters} from '@docusaurus/theme-common/internal';
import Author from '@theme/Author';
import type {Props} from '@theme/AuthorsListByLetter';
import Heading from '@theme/Heading';
import type {AuthorItemProp} from '@docusaurus/plugin-content-blog';
import styles from './styles.module.css';

function AuthorLetterEntryItem({
  letterEntry,
}: {
  letterEntry: LetterEntry<AuthorItemProp>;
}) {
  return (
    <article>
      <Heading as="h2" id={letterEntry.letter}>
        {letterEntry.letter}
      </Heading>
      <ul className="padding--none">
        {letterEntry.items.map((author) => (
          <li key={author.key} className={styles.author}>
            <Author author={author} />
          </li>
        ))}
      </ul>
      <hr />
    </article>
  );
}

export default function AuthorsListByLetter({authors}: Props): JSX.Element {
  const letterList = listAuthorsByLetters(authors);
  return (
    <section className="margin-vert--lg">
      {letterList.map((letterEntry) => (
        <AuthorLetterEntryItem
          key={letterEntry.letter}
          letterEntry={letterEntry}
        />
      ))}
    </section>
  );
}
