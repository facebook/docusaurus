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
  children: ReactNode;
}

export default function TweetQuote({
  url,
  handle,
  name,
  children,
}: Props): JSX.Element {
  const avatar = `https://unavatar.io/twitter/${handle}`;
  const profileUrl = `https://twitter.com/${handle}`;

  // TODO this is quit ugly...

  return (
    <figure className={styles.tweetQuote}>
      <blockquote>
        <a href={url} target="_blank" rel="noreferrer nofollow">
          {children}
        </a>
      </blockquote>
      <figcaption>
        <a href={profileUrl} target="_blank" rel="noreferrer nofollow">
          <div className="avatar">
            <img
              alt={name}
              className="avatar__photo"
              src={avatar}
              style={{width: 32, height: 32}}
              loading="lazy"
            />
            <div className={clsx('avatar__intro')}>
              <strong className="avatar__name">
                <cite>{name}</cite>
              </strong>
            </div>
          </div>
        </a>
      </figcaption>
    </figure>
  );
}
