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
  return (
    thisSidebar && (
      <div className={styles.sidebar}>
        {Object.keys(thisSidebar).map(categoryName => (
          <div className={styles.sidebarGroup} key={categoryName}>
            <h3 className={styles.sidebarGroupTitle}>{categoryName}</h3>
            <ul className={styles.sidebarList}>
              {thisSidebar[categoryName].map(rawLinkID => {
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
              })}
            </ul>
          </div>
        ))}
      </div>
    )
  );
}

export default Sidebar;
