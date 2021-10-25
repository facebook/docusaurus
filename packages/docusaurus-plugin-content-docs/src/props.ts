/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {LoadedVersion, VersionTag, DocMetadata} from './types';
import type {
  SidebarItemDoc,
  SidebarItemLink,
  SidebarItem,
} from './sidebars/types';
import type {
  PropSidebars,
  PropVersionMetadata,
  PropSidebarItem,
  PropTagDocList,
  PropTagDocListDoc,
} from '@docusaurus/plugin-content-docs-types';
import {compact, keyBy, mapValues} from 'lodash';

export function toSidebarsProp(loadedVersion: LoadedVersion): PropSidebars {
  const docsById = keyBy(loadedVersion.docs, (doc) => doc.id);

  const convertDocLink = (item: SidebarItemDoc): SidebarItemLink => {
    const docId = item.id;
    const docMetadata = docsById[docId];

    if (!docMetadata) {
      throw new Error(
        `Invalid sidebars file. The document with id "${docId}" was used in the sidebar, but no document with this id could be found.
Available document ids are:
- ${Object.keys(docsById).sort().join('\n- ')}`,
      );
    }

    const {
      title,
      permalink,
      frontMatter: {sidebar_label: sidebarLabel},
    } = docMetadata;

    return {
      type: 'link',
      label: sidebarLabel || item.label || title,
      href: permalink,
      className: item.className,
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
    banner: loadedVersion.versionBanner,
    badge: loadedVersion.versionBadge,
    className: loadedVersion.versionClassName,
    isLast: loadedVersion.isLast,
    docsSidebars: toSidebarsProp(loadedVersion),
  };
}

export function toTagDocListProp({
  allTagsPath,
  tag,
  docs,
}: {
  allTagsPath: string;
  tag: VersionTag;
  docs: Pick<DocMetadata, 'id' | 'title' | 'description' | 'permalink'>[];
}): PropTagDocList {
  function toDocListProp(): PropTagDocListDoc[] {
    const list = compact(
      tag.docIds.map((id) => docs.find((doc) => doc.id === id)),
    );
    // Sort docs by title
    list.sort((doc1, doc2) => doc1.title.localeCompare(doc2.title));
    return list.map((doc) => ({
      id: doc.id,
      title: doc.title,
      description: doc.description,
      permalink: doc.permalink,
    }));
  }

  return {
    name: tag.name,
    permalink: tag.permalink,
    docs: toDocListProp(),
    allTagsPath,
  };
}
