/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import SidebarLink from './SidebarLink';
import SidebarCategory from './SidebarCategory';
import styles from './styles.css';

function Sidebar(props) {
  const {metadata, docsSidebars, docsMetadatas} = props;
  const {sidebar, language} = metadata;

  if (!sidebar) {
    return null;
  }

  const thisSidebar = docsSidebars[sidebar];

  if (!thisSidebar) {
    throw new Error(`Can not find ${sidebar} config`);
  }

  const convertDocLink = item => {
    const linkID = (language ? `${language}-` : '') + item.id;
    const linkMetadata = docsMetadatas[linkID];

    if (!linkMetadata) {
      throw new Error(
        `Improper sidebars.json file, document with id '${linkID}' not found.`,
      );
    }

    return {
      type: 'link',
      label: linkMetadata.sidebar_label || linkMetadata.title,
      href: linkMetadata.permalink,
    };
  };

  const renderItem = (item, {root} = {}) => {
    switch (item.type) {
      case 'category':
        return (
          <SidebarCategory
            {...item}
            key={item.label}
            subCategory={!root}
            renderItem={renderItem}
          />
        );
      case 'link':
        return <SidebarLink {...item} key={item.href} />;
      case 'ref':
      default:
        return renderItem(convertDocLink(item));
    }
  };

  return (
    <div className={styles.sidebar}>
      {thisSidebar.map(item => renderItem(item, {root: true}))}
    </div>
  );
}

export default Sidebar;
