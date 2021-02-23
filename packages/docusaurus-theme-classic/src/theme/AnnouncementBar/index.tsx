/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import clsx from 'clsx';
import {useThemeConfig} from '@docusaurus/theme-common';
import useUserPreferencesContext from '@theme/hooks/useUserPreferencesContext';
import {translate} from '@docusaurus/Translate';

import styles from './styles.module.css';

function AnnouncementBar(): JSX.Element | null {
  const {
    isAnnouncementBarClosed,
    closeAnnouncementBar,
  } = useUserPreferencesContext();
  const {announcementBar} = useThemeConfig();

  if (!announcementBar) {
    return null;
  }

  const {content, backgroundColor, textColor, isCloseable} = announcementBar;
  if (!content || (isCloseable && isAnnouncementBarClosed)) {
    return null;
  }

  return (
    <div
      className={styles.announcementBar}
      style={{backgroundColor, color: textColor}}
      role="banner">
      <div
        className={clsx(styles.announcementBarContent, {
          [styles.announcementBarCloseable]: isCloseable,
        })}
        // Developer provided the HTML, so assume it's safe.
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{__html: content}}
      />
      {isCloseable ? (
        <button
          type="button"
          className={styles.announcementBarClose}
          onClick={closeAnnouncementBar}
          aria-label={translate({
            id: 'theme.AnnouncementBar.closeButtonAriaLabel',
            message: 'Close',
            description: 'The ARIA label for close button of announcement bar',
          })}>
          <span aria-hidden="true">×</span>
        </button>
      ) : null}
    </div>
  );
}

export default AnnouncementBar;
