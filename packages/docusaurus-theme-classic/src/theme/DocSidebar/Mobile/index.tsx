/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import clsx from 'clsx';
import {
  useThemeConfig,
  NavbarSecondaryMenuFiller,
  type NavbarSecondaryMenuComponent,
  ThemeClassNames,
  useNavbarMobileSidebar,
  useDocsFilter,
  filterDocsSidebar,
} from '@docusaurus/theme-common';
import DocSidebarItems from '@theme/DocSidebarItems';
import Filter from '@theme/DocSidebar/Common/Filter';
import type {Props} from '@theme/DocSidebar/Mobile';

import styles from './styles.module.css';

// eslint-disable-next-line react/function-component-definition
const DocSidebarMobileSecondaryMenu: NavbarSecondaryMenuComponent<Props> = ({
  sidebar,
  path,
}) => {
  const {filterableSidebar} = useThemeConfig();
  const {filterTerm} = useDocsFilter();
  const filteredSidebar = filterDocsSidebar(sidebar, filterTerm);
  const mobileSidebar = useNavbarMobileSidebar();
  return (
    <>
      {filterableSidebar && <Filter className={styles.filter} />}
      <ul className={clsx(ThemeClassNames.docs.docSidebarMenu, 'menu__list')}>
        <DocSidebarItems
          items={filteredSidebar}
          activePath={path}
          onItemClick={(item) => {
            // Mobile sidebar should only be closed if the category has a link
            if (item.type === 'category' && item.href) {
              mobileSidebar.toggle();
            }
            if (item.type === 'link') {
              mobileSidebar.toggle();
            }
          }}
          level={1}
        />
      </ul>
    </>
  );
};

function DocSidebarMobile(props: Props) {
  return (
    <NavbarSecondaryMenuFiller
      component={DocSidebarMobileSecondaryMenu}
      props={props}
    />
  );
}

export default React.memo(DocSidebarMobile);
