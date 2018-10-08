import React from 'react';
import {Link} from 'react-router-dom';

import classnames from 'classnames';

import styles from './styles.css';

function Sidebar(props) {
  const {metadata, docsSidebars, docsMetadatas} = props;
  const {sidebar, language, id: thisID} = metadata;
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
    const activeItem = linkID === thisID;
    return (
      <li key={linkID}>
        <Link
          className={classnames(styles.sidebarLink, {
            [styles.sidebarLinkActive]: activeItem,
          })}
          to={linkMetadata.permalink}>
          {linkMetadata.sidebar_label || linkMetadata.title}
        </Link>
      </li>
    );
  };

  const renderCategory = categoryName => {
    const category = thisSidebar[categoryName];
    return (
      <div className={styles.sidebarGroup} key={categoryName}>
        <h3 className={styles.sidebarGroupTitle}>{categoryName}</h3>
        <ul className={styles.sidebarList}>
          {Array.isArray(category)
            ? category.map(renderItemLink)
            : Object.keys(category).map(subCategoryName => (
                <div className={styles.sidebarSubGroup} key={subCategoryName}>
                  <h4 className={styles.sidebarSubGroupTitle}>
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
