/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {memo} from 'react';

import styles from './styles.module.css';
import clsx from 'clsx';
import Image from '@theme/IdealImage';
import {Tags, TagList, TagType, User, Tag} from '../../../data/users';
import {sortBy} from '../../../utils/jsUtils';

function Tag({label, description}: Tag) {
  return (
    <li
      aria-label={label}
      className={styles.tag}
      // TODO add a proper tooltip
      title={description}>
      <span>{label.toLowerCase()}</span>
    </li>
  );
}

function ShowcaseCardTag({tags}: {tags: TagType[]}) {
  const tagObjects = tags.map((tag) => ({tag, ...Tags[tag]}));

  // Keep same order for all tags
  const tagObjectsSorted = sortBy(tagObjects, (tagObject) =>
    TagList.indexOf(tagObject.tag),
  );

  return (
    <>
      {tagObjectsSorted.map((tagObject, index) => (
        <Tag key={index} {...tagObject} />
      ))}
    </>
  );
}

const ShowcaseCard = memo(function ({user}: {user: User}) {
  return (
    <li
      key={user.title}
      tabIndex={0}
      title={user.title}
      className={clsx('card shadow--md', styles.showcaseCard)}>
      <div className="card__image">
        <Image img={user.preview} alt={user.title} />
      </div>
      <div className={clsx('card__body', styles.showcaseContent)}>
        <div>
          <div className={styles.showcaseCardHeader}>
            <h4 className={styles.showcaseCardTitle}>
              <a
                href={user.website}
                tabIndex={0}
                className={styles.showcaseCardLink}>
                {user.title}
              </a>
            </h4>
            <a
              href={user.source}
              tabIndex={0}
              className={clsx(
                'button button--secondary button--sm',
                styles.showcaseCardSrcBtn,
              )}>
              source
            </a>
          </div>
          <p className={styles.showcaseCardBody}>{user.description}</p>
          <ul className={styles.cardFooter}>
            <ShowcaseCardTag tags={user.tags} />
          </ul>
        </div>
      </div>
    </li>
  );
});

export default ShowcaseCard;
