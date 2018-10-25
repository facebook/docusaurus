/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import {Link} from 'react-router-dom';

import styles from './styles.css';

export default class DocsPaginator extends React.Component {
  render() {
    const {docsMetadatas, metadata} = this.props;
    return (
      <div className={styles.paginatorContainer}>
        <div>
          {metadata.previous &&
            docsMetadatas[metadata.previous] && (
              <Link
                className={styles.paginatorLink}
                to={docsMetadatas[metadata.previous].permalink}>
                <svg className={styles.arrow} viewBox="0 0 24 24">
                  <g>
                    <line x1="19" y1="12" x2="5" y2="12" />
                    <polyline points="12 19 5 12 12 5" />
                  </g>
                </svg>{' '}
                <span className={styles.label}>{metadata.previous_title}</span>
              </Link>
            )}
        </div>
        <div className={styles.paginatorRightContainer}>
          {metadata.next &&
            docsMetadatas[metadata.next] && (
              <Link
                className={styles.paginatorLink}
                to={docsMetadatas[metadata.next].permalink}>
                <span className={styles.label}>{metadata.next_title}</span>{' '}
                <svg className={styles.arrow} viewBox="0 0 24 24">
                  <g>
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </g>
                </svg>
              </Link>
            )}
        </div>
      </div>
    );
  }
}
