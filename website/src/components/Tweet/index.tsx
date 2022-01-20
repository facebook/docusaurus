/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {type ReactNode} from 'react';

import clsx from 'clsx';

import styles from './styles.module.css';

interface Props {
  url: string;
  handle: string;
  name: ReactNode;
  content: string;
  avatar: string;
  date: string;
}

export default function Tweet({ url, handle, name, content, avatar, date }: Props) {
  return (
    <div className={clsx('card', styles.tweet)}>
      <div className="card__header">
        <div className="avatar">
          <img className="avatar__photo" src={avatar} />
          <div className="avatar__intro">
            <div className={styles.tweet}>
              <strong>{name}</strong>{' '}
              <span className={styles.tweetMeta}>
                @{handle} &middot;{' '}
                <a className={styles.tweetMeta} href={url}>
                  {date}
                </a>
              </span>
            </div>
            <div>{content}</div>
          </div>
        </div>
      </div>
    </div>
  );
}