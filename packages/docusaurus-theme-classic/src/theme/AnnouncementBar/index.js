/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {forwardRef, useState} from 'react';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

import styles from './styles.module.css';

const STORAGE_KEY = 'announcement_closed';

const AnnouncementBar = forwardRef((props, ref) => {
  const {
    siteConfig: {themeConfig: {announcementBar = {}}} = {},
  } = useDocusaurusContext();
  const {content, backgroundColor, textColor} = announcementBar;

  if (!content) {
    return null;
  }

  const [isClosed, setClosed] = useState(false);
  const handleClose = () => {
    sessionStorage.setItem(STORAGE_KEY, true);
    setClosed(true);
  };
  const storedClosed = ExecutionEnvironment.canUseDOM
    ? sessionStorage.getItem(STORAGE_KEY)
    : false;

  if (!announcementBar || isClosed || storedClosed) {
    return null;
  }

  return (
    <div
      ref={ref}
      className={styles.announcementBar}
      style={{backgroundColor, color: textColor}}
      role="banner">
      <button
        type="button"
        className={styles.announcementBarClose}
        onClick={handleClose}
        aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>

      <div
        className={styles.announcementBarContent}
        dangerouslySetInnerHTML={{__html: content}}
      />
    </div>
  );
});

export default AnnouncementBar;
