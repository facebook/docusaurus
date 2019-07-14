/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useEffect} from 'react';
import Layout from '@theme/Layout';

import classnames from 'classnames';
import styles from './styles.module.css';
import users from './users';

const ITEMS_PER_ROW = 3; // Sync up the item col width if this is changed.

function chunkArray(array, size) {
  const chunks = [];
  const copied = [...array];
  const numChunks = Math.ceil(copied.length / size); // Round up to the nearest integer.
  for (let i = 0; i < numChunks; i++) {
    chunks.push(copied.splice(0, size));
  }

  return chunks;
}

function Showcase() {
  return (
    <Layout permalink="/showcase" description="Docusaurus users">
      <div className="container margin-vert--xl">
        <div className="text--center margin-bottom--xl">
          <h1>Showcase</h1>
          <p>See the awesome websites people are building with Docusaurus!</p>
        </div>
        {chunkArray(users, ITEMS_PER_ROW).map(row => (
          <div className="row margin-vert--lg">
            {row.map(user => (
              <div className="col col--4">
                <div className={classnames('card', styles.showcaseUser)}>
                  <div className="card__image">
                    <img src={user.preview} alt={user.title} />
                  </div>
                  <div className="card__body">
                    <div class="avatar">
                      <div class="avatar__intro margin-left--none">
                        <h4 class="avatar__name">{user.title}</h4>
                        <small class="avatar__subtitle">
                          {user.description}
                        </small>
                      </div>
                    </div>
                  </div>
                  {(user.website || user.source) && (
                    <div className="card__footer">
                      <div class="button-group button-group--block">
                        {user.website && (
                          <a
                            className="button button--small button--secondary button--block"
                            href={user.website}
                            target="_blank"
                            rel="noreferrer noopener">
                            Website
                          </a>
                        )}
                        {user.source && (
                          <a
                            className="button button--small button--secondary button--block"
                            href={user.source}
                            target="_blank"
                            rel="noreferrer noopener">
                            Source
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </Layout>
  );
}

export default Showcase;
