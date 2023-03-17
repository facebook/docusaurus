/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useEffect} from 'react';
import {useThemeConfig} from '@docusaurus/theme-common';
import {useAnnouncementBar, watchAnnouncementBarHeight} from '@docusaurus/theme-common/internal';
import AnnouncementBarCloseButton from '@theme/AnnouncementBar/CloseButton';
import AnnouncementBarContent from '@theme/AnnouncementBar/Content';

import styles from './styles.module.css';

export default function AnnouncementBar(): JSX.Element | null {
  const {announcementBar} = useThemeConfig();
  const {isActive, close} = useAnnouncementBar();

  useEffect(() => watchAnnouncementBarHeight(styles.announcementBar!), []);

  if (!isActive) {
    return null;
  }
  const {backgroundColor, textColor, isCloseable} = announcementBar!;
  return (
    <div
      className={styles.announcementBar}
      style={{backgroundColor, color: textColor}}
      role="banner">
      {isCloseable && <div className={styles.announcementBarPlaceholder} />}
      <AnnouncementBarContent className={styles.announcementBarContent} />
      {isCloseable && (
        <AnnouncementBarCloseButton
          onClick={close}
          className={styles.announcementBarClose}
        />
      )}
    </div>
  );
}
