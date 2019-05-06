/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import Link from '@docusaurus/Link'; // eslint-disable-line

import './styles.css';

function DocSidebar(props) {
  const {docsMetadata, location} = props;

  const id =
    docsMetadata.permalinkToId[location.pathname] ||
    docsMetadata.permalinkToId[location.pathname.replace(/\/$/, '')];
  const metadata = docsMetadata.docs[id] || {};
  const {sidebar} = metadata;

  if (!sidebar) {
    return null;
  }

  const thisSidebar = docsMetadata.docsSidebars[sidebar];

  if (!thisSidebar) {
    throw new Error(`Can not find ${sidebar} config`);
  }

  const convertDocLink = item => {
    const linkID = item.id;
    const linkMetadata = docsMetadata.docs[linkID];

    if (!linkMetadata) {
      throw new Error(
        `Improper sidebars file, document with id '${linkID}' not found.`,
      );
    }

    return {
      type: 'link',
      label: linkMetadata.sidebar_label || linkMetadata.title,
      href: linkMetadata.permalink,
    };
  };

  const renderItem = item => {
    switch (item.type) {
      case 'category':
        return (
          <li className="menu__list-item" key={item.label}>
            <a className="menu__link" href="#!">
              {item.label}
            </a>
            <ul className="menu__list">{item.items.map(renderItem)}</ul>
          </li>
        );

      case 'link':
        return (
          <li className="menu__list-item" key={item.label}>
            <Link className="menu__link" to={item.href}>
              {item.label}
            </Link>
          </li>
        );

      case 'ref':
      default:
        return renderItem(convertDocLink(item));
    }
  };

  return (
    <div className="container margin-vert--lg">
      <div className="menu menu--responsive sidebar">
        <ul className="menu__list">
          {thisSidebar.map(item => renderItem(item, {root: true}))}
        </ul>
      </div>
    </div>
  );
}

export default DocSidebar;
