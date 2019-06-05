/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import classnames from 'classnames';

import styles from './styles.module.css';

function BrowserWindow({children, minHeight, url}) {
  return (
    <div className={styles.container} style={{minHeight}}>
      <div className={styles.row}>
        <div className={classnames(styles.column, styles.left)}>
          <span className={styles.dot} style={{background: '#ED594A'}} />
          <span className={styles.dot} style={{background: '#FDD800'}} />
          <span className={styles.dot} style={{background: '#5AC05A'}} />
        </div>
        <div className={classnames(styles.column, styles.middle)}>
          <input disabled={true} type="text" value={url} readOnly />
        </div>
        <div className={classnames(styles.column, styles.right)}>
          <div style={{float: 'right'}}>
            <span className={styles.bar} />
            <span className={styles.bar} />
            <span className={styles.bar} />
          </div>
        </div>
      </div>

      <div className={styles.content}>{children}</div>
    </div>
  );
}

export default BrowserWindow;
