/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useAnnouncementBarContext from '@theme/hooks/useAnnouncementBarContext';

import styles from './styles.module.css';

function AnnouncementBar() {
  const {
    siteConfig: {themeConfig: {announcementBar = {}}} = {},
  } = useDocusaurusContext();
  const {content, backgroundColor, textColor} = announcementBar;
  const {
    isAnnouncementBarClosed,
    closeAnnouncementBar,
  } = useAnnouncementBarContext();

  if (!content || isAnnouncementBarClosed) {
    return null;
  }

  return (
    <div
      className={styles.announcementBar}
      style={{backgroundColor, color: textColor}}
      role="banner">
      <div
        className={styles.announcementBarContent}
        dangerouslySetInnerHTML={{__html: content}}
      />

      <button
        type="button"
        className={styles.announcementBarClose}
        onClick={closeAnnouncementBar}
        aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  );
}

export default AnnouncementBar;
