/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useState, useEffect} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

import styles from './styles.module.css';

const STORAGE_DISMISS_KEY = 'docusaurus.announcement.dismiss';
const STORAGE_VIEWED_MESSAGE_KEY = 'docusaurus.announcement.viewed_message';

function AnnouncementBar() {
  const {
    siteConfig: {themeConfig: {announcementBar = {}}} = {},
  } = useDocusaurusContext();
  const {content, backgroundColor, textColor} = announcementBar;
  const [isClosed, setClosed] = useState(true);
  const handleClose = () => {
    sessionStorage.setItem(STORAGE_DISMISS_KEY, true);
    setClosed(true);
  };

  useEffect(() => {
    const currentAnnouncement = JSON.stringify(content);
    const oldAnnouncement = sessionStorage.getItem(STORAGE_VIEWED_MESSAGE_KEY);
    const isNewAnnouncement = currentAnnouncement !== oldAnnouncement;

    sessionStorage.setItem(STORAGE_VIEWED_MESSAGE_KEY, currentAnnouncement);

    if (isNewAnnouncement) {
      sessionStorage.setItem(STORAGE_DISMISS_KEY, false);
    }

    if (
      isNewAnnouncement ||
      sessionStorage.getItem(STORAGE_DISMISS_KEY) === 'false'
    ) {
      setClosed(false);
    }
  }, []);

  if (!content || isClosed) {
    return null;
  }

  return (
    <div
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
}

export default AnnouncementBar;
