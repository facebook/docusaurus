/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  LoadedVersion,
  SidebarItemDoc,
  SidebarItemLink,
  SidebarItem,
} from './types';
import {
  PropSidebars,
  PropVersionMetadata,
  PropSidebarItem,
} from '@docusaurus/plugin-content-docs-types';
import {keyBy, mapValues} from 'lodash';

export function toSidebarsProp(loadedVersion: LoadedVersion): PropSidebars {
  const docsById = keyBy(loadedVersion.docs, (doc) => doc.id);

  const convertDocLink = (item: SidebarItemDoc): SidebarItemLink => {
    const docId = item.id;
    const docMetadata = docsById[docId];

    if (!docMetadata) {
      throw new Error(
        `Bad sidebars file. The document id '${docId}' was used in the sidebar, but no document with this id could be found.
Available document ids=
- ${Object.keys(docsById).sort().join('\n- ')}`,
      );
    }

    const {title, permalink, sidebar_label: sidebarLabel} = docMetadata;

    return {
      type: 'link',
      label: sidebarLabel || item.label || title,
      href: permalink,
      customProps: item.customProps,
    };
  };

  const normalizeItem = (item: SidebarItem): PropSidebarItem => {
    switch (item.type) {
      case 'category':
        return {...item, items: item.items.map(normalizeItem)};
      case 'ref':
      case 'doc':
        return convertDocLink(item);
      case 'link':
      default:
        return item;
    }
  };

  // Transform the sidebar so that all sidebar item will be in the
  // form of 'link' or 'category' only.
  // This is what will be passed as props to the UI component.
  return mapValues(loadedVersion.sidebars, (items) => items.map(normalizeItem));
}

export function toVersionMetadataProp(
  pluginId: string,
  loadedVersion: LoadedVersion,
): PropVersionMetadata {
  return {
    pluginId,
    version: loadedVersion.versionName,
    label: loadedVersion.versionLabel,
    isLast: loadedVersion.isLast,
    docsSidebars: toSidebarsProp(loadedVersion),
    permalinkToSidebar: loadedVersion.permalinkToSidebar,
  };
}
