/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Translate from '@docusaurus/Translate';
import {sortBy} from '@docusaurus/plugin-content-showcase/client';
import {useShowcase} from '@docusaurus/theme-common/internal';
import Heading from '@theme/Heading';
import FavoriteIcon from '@theme/Showcase/FavoriteIcon';
import type {ShowcaseItem, TagType} from '@docusaurus/plugin-content-showcase';
import styles from './styles.module.css';

function TagItem({
  label,
  description,
  color,
}: {
  label: string;
  description: {
    message: string;
    id: string;
  };
  color: string;
}) {
  return (
    <li className={styles.tag} title={description.message}>
      <span className={styles.textLabel}>{label.toLowerCase()}</span>
      <span className={styles.colorLabel} style={{backgroundColor: color}} />
    </li>
  );
}

function ShowcaseCardTag({tags}: {tags: TagType[]}) {
  const {tags: Tags} = useShowcase();
  const TagList = Object.keys(Tags) as TagType[];

  const tagObjects = tags.map((tag) => ({tag, ...Tags[tag]}));

  // Keep same order for all tags
  const tagObjectsSorted = sortBy(tagObjects, (tagObject) =>
    TagList.indexOf(tagObject.tag),
  );

  return (
    <>
      {tagObjectsSorted.map((tagObject, index) => {
        return <TagItem key={index} {...tagObject} />;
      })}
    </>
  );
}

function getCardImage(item: ShowcaseItem): string {
  return (
    item.preview ??
    // TODO make it configurable
    `https://slorber-api-screenshot.netlify.app/${encodeURIComponent(
      item.website,
    )}/showcase`
  );
}

function ShowcaseCard({item}: {item: ShowcaseItem}) {
  const image = getCardImage(item);
  return (
    <li key={item.title} className="card shadow--md">
      <div className={clsx('card__image', styles.showcaseCardImage)}>
        <img src={image} alt={item.title} />
      </div>
      <div className="card__body">
        <div className={clsx(styles.showcaseCardHeader)}>
          <Heading as="h4" className={styles.showcaseCardTitle}>
            <Link href={item.website} className={styles.showcaseCardLink}>
              {item.title}
            </Link>
          </Heading>
          {item.tags.includes('favorite') && (
            <FavoriteIcon size="medium" style={{marginRight: '0.25rem'}} />
          )}
          {item.source && (
            <Link
              href={item.source}
              className={clsx(
                'button button--secondary button--sm',
                styles.showcaseCardSrcBtn,
              )}>
              <Translate id="showcase.card.sourceLink">source</Translate>
            </Link>
          )}
        </div>
        <p className={styles.showcaseCardBody}>{item.description}</p>
      </div>
      <ul className={clsx('card__footer', styles.cardFooter)}>
        <ShowcaseCardTag tags={item.tags} />
      </ul>
    </li>
  );
}

export default React.memo(ShowcaseCard);
