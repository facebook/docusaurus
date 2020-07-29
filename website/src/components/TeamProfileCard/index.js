/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

export default function TeamProfileCard({
  className,
  name,
  children,
  githubUrl,
  twitterUrl,
}) {
  return (
    <div className={className}>
      <div className="card card--full-height">
        <div className="card__header">
          <div className="avatar avatar--vertical">
            <img
              className="avatar__photo avatar__photo--xl"
              src={githubUrl + '.png'}
            />
            <div className="avatar__intro">
              <h3 className="avatar__name">{name}</h3>
            </div>
          </div>
        </div>
        <div className="card__body">{children}</div>
        <div className="card__footer">
          <div className="button-group button-group--block">
            {githubUrl && (
              <a className="button button--secondary" href={githubUrl}>
                GitHub
              </a>
            )}
            {twitterUrl && (
              <a className="button button--secondary" href={twitterUrl}>
                Twitter
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
