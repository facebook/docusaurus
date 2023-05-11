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
  const [dynamicHeight, setDynamicHeight] = useState(0);

  const {
    navbar: {hideOnScroll},
    docs: {
      sidebar: {hideable},
    },
  } = useThemeConfig();

  useLayoutEffect(() => {
    if (isActive) {
      setDynamicHeight(30);
    } else {
      setDynamicHeight(0);
    }
  }, [isActive]);

  useScrollPosition(
    ({scrollY}) => {
      if (isActive) {
        setDynamicHeight(30 - scrollY);
      }
    },

    [isActive],
  );

  return (
    <div
      className={clsx(
        styles.sidebar,
        hideOnScroll && styles.sidebarWithHideableNavbar,
        isHidden && styles.sidebarHidden,
      )}
      style={{
        height:
          isActive && dynamicHeight >= 0 && dynamicHeight <= 30
            ? `calc(100% - ${dynamicHeight}px)`
            : '100%',
      }}>
      {hideOnScroll && <Logo tabIndex={-1} className={styles.sidebarLogo} />}
      <Content path={path} sidebar={sidebar} />
      {hideable && <CollapseButton onClick={onCollapse} />}
    </div>
  );
}

export default React.memo(DocSidebarDesktop);
