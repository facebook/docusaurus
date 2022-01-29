/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {type ReactNode} from 'react';

import clsx from 'clsx';

import styles from './styles.module.css';

export interface Props {
  url: string;
  handle: string;
  name: string;
  content: ReactNode;
  avatar: string;
  date: string;
}

export default function Tweet({
  url,
  handle,
  name,
  content,
  avatar,
  date,
}: Props): JSX.Element {
  return (
    <div className={clsx('card', styles.tweet)}>
      <div className="card__header">
        <div className="avatar">
          <img alt={name} className="avatar__photo" src={avatar} />
          <div className="avatar__intro">
            <div className={styles.tweet}>
              <div>
                <strong>{name}</strong>{' '}
                <span className={styles.tweetMeta}>@{handle}</span>
              </div>
            </div>
            <div className="margin-bottom--sm">{content}</div>
            <a className={clsx(styles.tweetMeta, styles.tweetDate)} href={url}>
              {date}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
