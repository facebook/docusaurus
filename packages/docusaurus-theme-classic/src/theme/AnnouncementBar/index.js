/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useState, useEffect} from 'react';
import classnames from 'classnames';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

import styles from './styles.module.css';

const STORAGE_DISMISS_KEY = 'docusaurus.announcement.dismiss';
const STORAGE_ID_KEY = 'docusaurus.announcement.id';

function AnnouncementBar() {
  const {
    siteConfig: {themeConfig: {announcementBar = {}}} = {},
  } = useDocusaurusContext();
  const {id, content, backgroundColor, textColor} = announcementBar;
  const [isClosed, setClosed] = useState(true);
  const handleClose = () => {
    localStorage.setItem(STORAGE_DISMISS_KEY, true);
    setClosed(true);
  };

  useEffect(() => {
    const viewedId = localStorage.getItem(STORAGE_ID_KEY);
    const isNewAnnouncement = id !== viewedId;

    localStorage.setItem(STORAGE_ID_KEY, id);

    if (isNewAnnouncement) {
      localStorage.setItem(STORAGE_DISMISS_KEY, false);
    }

    if (
      isNewAnnouncement ||
      localStorage.getItem(STORAGE_DISMISS_KEY) === 'false'
    ) {
      setClosed(false);
    }
  }, []);

  if (!content || isClosed) {
    return null;
  }

  return (
    <div
      className={classnames('announcment-bar', styles.announcementBar)}
      style={{backgroundColor, color: textColor}}
      role="banner">
      <div
        className={classnames('announcment-bar__content', styles.announcementBarContent)}
        dangerouslySetInnerHTML={{__html: content}}
      />

      <button
        type="button"
        className={styles.announcementBarClose}
        onClick={handleClose}
        aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  );
}

export default AnnouncementBar;
