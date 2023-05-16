/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useState, useLayoutEffect} from 'react';
import clsx from 'clsx';
import {useThemeConfig} from '@docusaurus/theme-common';
import {
  useAnnouncementBar,
  useScrollPosition,
} from '@docusaurus/theme-common/internal';
import Logo from '@theme/Logo';
import CollapseButton from '@theme/DocSidebar/Desktop/CollapseButton';
import Content from '@theme/DocSidebar/Desktop/Content';
import type {Props} from '@theme/DocSidebar/Desktop';

import styles from './styles.module.css';

function DocSidebarDesktop({path, sidebar, onCollapse, isHidden}: Props) {
  const {isActive} = useAnnouncementBar();
  const [announcementBarHandler, setAnnouncementBarHandler] = useState({
    barActive: false,
    height: 0,
  });

  const {
    navbar: {hideOnScroll},
    docs: {
      sidebar: {hideable},
    },
  } = useThemeConfig();

  useLayoutEffect(() => {
    if (isActive) {
      setAnnouncementBarHandler({barActive: isActive, height: 30});
    } else {
      setAnnouncementBarHandler({barActive: isActive, height: 0});
    }
  }, [isActive]);

  useScrollPosition(
    ({scrollY}) => {
      if (isActive) {
        setAnnouncementBarHandler((prevState) => ({
          ...prevState,
          height: 30 - scrollY,
        }));
      }
    },

    [announcementBarHandler.height],
  );

  return (
    <div
      className={clsx(
        announcementBarHandler.barActive
          ? styles.sidebarAnnouncementActive
          : styles.sidebarAnnouncementInactive,
        styles.sidebar,
        hideOnScroll && styles.sidebarWithHideableNavbar,
        isHidden && styles.sidebarHidden,
      )}
      style={{
        height:
          announcementBarHandler.barActive &&
          announcementBarHandler.height >= 0 &&
          announcementBarHandler.height <= 30
            ? `calc(100% - ${announcementBarHandler.height}px)`
            : '100%',
      }}>
      {hideOnScroll && <Logo tabIndex={-1} className={styles.sidebarLogo} />}
      <Content path={path} sidebar={sidebar} />
      {hideable && <CollapseButton onClick={onCollapse} />}
    </div>
  );
}

export default React.memo(DocSidebarDesktop);
