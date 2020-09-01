/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useUserPreferencesContext from '@theme/hooks/useUserPreferencesContext';

import styles from './styles.module.css';

function AnnouncementBar(): JSX.Element | null {
  const {
    siteConfig: {themeConfig: {announcementBar = {}} = {}} = {},
  } = useDocusaurusContext();
  const {content, backgroundColor, textColor, isCloseable} = announcementBar;
  const {
    isAnnouncementBarClosed,
    closeAnnouncementBar,
  } = useUserPreferencesContext();

  if (!content || (isCloseable && isAnnouncementBarClosed)) {
    return null;
  }

  return (
    <div
      className={styles.announcementBar}
      style={{backgroundColor, color: textColor}}
      role="banner">
      <div
        className={styles.announcementBarContent}
        // Developer provided the HTML, so assume it's safe.
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{__html: content}}
      />
      {isCloseable ? (
        <button
          type="button"
          className={styles.announcementBarClose}
          onClick={closeAnnouncementBar}
          aria-label="Close">
          <span aria-hidden="true">×</span>
        </button>
      ) : null}
    </div>
  );
}

export default AnnouncementBar;
