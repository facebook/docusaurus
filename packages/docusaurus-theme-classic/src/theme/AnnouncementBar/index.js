/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useState} from 'react';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import withForwardedRef from '@theme/hocs/withForwardedRef';

import styles from './styles.module.css';

const STORAGE_KEY = 'announcement_closed';

const AnnouncementBar = ({forwardedRef}) => {
  const {
    siteConfig: {themeConfig: {announcementBar = {}}} = {},
  } = useDocusaurusContext();
  const {content, backgroundColor, textColor} = announcementBar;
  const [isClosed, setClosed] = useState(false);
  const storedClosed = ExecutionEnvironment.canUseDOM
    ? sessionStorage.getItem(STORAGE_KEY)
    : false;
  const handleClose = () => {
    sessionStorage.setItem(STORAGE_KEY, true);
    setClosed(true);
  };

  if (!content || storedClosed || isClosed) {
    return null;
  }

  return (
    <div
      ref={forwardedRef}
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
};

export default withForwardedRef(AnnouncementBar);
