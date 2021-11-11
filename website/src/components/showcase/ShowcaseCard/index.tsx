/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {memo} from 'react';
import clsx from 'clsx';
import Image from '@theme/IdealImage';

import styles from './styles.module.css';
import FavoriteIcon from '../../svgIcons/FavoriteIcon';
import Tooltip from '../showcaseTooltip';
import {Tags, TagList, TagType, User, Tag} from '../../../data/users';
import {sortBy} from '../../../utils/jsUtils';

interface Props extends Tag {
  id: string;
}

const TagComp = React.forwardRef(
  ({id, label, description}: Props, ref: React.RefObject<HTMLLIElement>) => {
    return (
      <li
        ref={ref}
        aria-describedby={id}
        className={styles.tag}
        title={description}>
        <span>{label.toLowerCase()}</span>
      </li>
    );
  },
);

function ShowcaseCardTag({tags}: {tags: TagType[]}) {
  const tagObjects = tags.map((tag) => ({tag, ...Tags[tag]}));

  // Keep same order for all tags
  const tagObjectsSorted = sortBy(tagObjects, (tagObject) =>
    TagList.indexOf(tagObject.tag),
  );

  return (
    <>
      {tagObjectsSorted.map((tagObject, index) => {
        const id = `showcase_card_tag_${tagObject.tag}`;

        return (
          <Tooltip
            key={index}
            text={tagObject.description}
            anchorEl="#__docusaurus"
            id={id}>
            <TagComp id={id} key={index} {...tagObject} />
          </Tooltip>
        );
      })}
    </>
  );
}

const ShowcaseCard = memo(function ({user}: {user: User}) {
  return (
    <li key={user.title} className={clsx('card', styles.showcaseCard)}>
      <div className={clsx('card__image', styles.showcaseCardImage)}>
        <Image img={user.preview} alt={user.title} />
      </div>
      <div className="card__body">
        <div className={clsx(styles.showcaseCardHeader)}>
          <h4 className={styles.showcaseCardTitle}>
            <a
              target="noreferer noopener"
              href={user.website}
              tabIndex={0}
              className={styles.showcaseCardLink}>
              {user.title}
            </a>
          </h4>
          {user.tags.includes('favorite') && (
            <FavoriteIcon svgClass={styles.svgIconFavorite} size="small" />
          )}
          <a
            href={user.source}
            tabIndex={0}
            target="noreferer noopener"
            className={clsx(
              'button button--secondary button--sm',
              styles.showcaseCardSrcBtn,
            )}>
            source
          </a>
        </div>
        <p className={styles.showcaseCardBody}>{user.description}</p>
      </div>
      <ul className={clsx('card__footer', styles.cardFooter)}>
        <ShowcaseCardTag tags={user.tags} />
      </ul>
    </li>
  );
});

export default ShowcaseCard;
