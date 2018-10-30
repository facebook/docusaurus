/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import styles from './styles.module.css';

export default props => {
  if (props.error) {
    console.log(props.error);
    return <div align="center">Error</div>;
  }
  if (props.pastDelay) {
    return (
      <div className={styles.loader}>
        <p>Please wait a moment</p>
        <div className={styles.loaderSpinning} />
      </div>
    );
  }
  return null;
};
