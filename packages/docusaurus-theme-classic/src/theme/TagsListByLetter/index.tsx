/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {listTagsByLetters, type TagLetterEntry} from '@docusaurus/theme-common';
import Tag from '@theme/Tag';
import type {Props} from '@theme/TagsListByLetter';
import type {CharMap} from '@docusaurus/types';

import styles from './styles.module.css';

function TagLetterEntryItem({letterEntry}: {letterEntry: TagLetterEntry}) {
  return (
    <article>
      <h2>{letterEntry.letter}</h2>
      <ul className="padding--none">
        {letterEntry.tags.map((tag) => (
          <li key={tag.permalink} className={styles.tag}>
            <Tag {...tag} />
          </li>
        ))}
      </ul>
      <hr />
    </article>
  );
}

export default function TagsListByLetter({tags}: Props): JSX.Element {
  const {
    i18n: {localeConfigs, currentLocale},
  } = useDocusaurusContext();
  const charMap: CharMap | undefined = localeConfigs[currentLocale]?.charMap;
  const letterList: TagLetterEntry[] = listTagsByLetters(tags, charMap);
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
