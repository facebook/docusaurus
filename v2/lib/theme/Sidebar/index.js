import React from 'react';
import {NavLink} from 'react-router-dom';

import classnames from 'classnames';

import styles from './styles.css';

function Sidebar(props) {
  const {metadata, docsSidebars, docsMetadatas} = props;
  const {sidebar, language} = metadata;
  if (!sidebar || !docsSidebars) {
    return null;
  }
  const thisSidebar = docsSidebars[sidebar];

  const renderItemLink = rawLinkID => {
    const linkID = (language ? `${language}-` : '') + rawLinkID;
    const linkMetadata = docsMetadatas[linkID];
    if (!linkMetadata) {
      throw new Error(
        `Improper sidebars.json file, document with id '${linkID}' not found.`,
      );
    }

    return (
      <li className={styles.sidebarListItem} key={linkID}>
        <NavLink
          activeClassName={styles.sidebarLinkActive}
          className={classnames(styles.sidebarLink, styles.sidebarItem)}
          to={linkMetadata.permalink}>
          {linkMetadata.sidebar_label || linkMetadata.title}
        </NavLink>
      </li>
    );
  };

  const renderCategory = categoryName => {
    const category = thisSidebar[categoryName];
    return (
      <div className={styles.sidebarGroup} key={categoryName}>
        <h3
          className={classnames(
            styles.sidebarItem,
            styles.sidebarGroupTitle,
            styles.sidebarGroupCategoryTitle,
          )}>
          {categoryName}
        </h3>
        <ul className={styles.sidebarList}>
          {Array.isArray(category)
            ? category.map(renderItemLink)
            : Object.keys(category).map(subCategoryName => (
                <div className={styles.sidebarSubGroup} key={subCategoryName}>
                  <h4
                    className={classnames(
                      styles.sidebarItem,
                      styles.sidebarGroupTitle,
                      styles.sidebarGroupSubcategorytitle,
                    )}>
                    {subCategoryName}
                  </h4>
                  <ul className={styles.sidebarList}>
                    {category[subCategoryName].map(renderItemLink)}
                  </ul>
                </div>
              ))}
        </ul>
      </div>
    );
  };

  return (
    thisSidebar && (
      <div className={styles.sidebar}>
        {Object.keys(thisSidebar).map(renderCategory)}
      </div>
    )
  );
}

export default Sidebar;
