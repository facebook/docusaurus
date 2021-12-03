/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {LoadedVersion, VersionTag, DocMetadata} from './types';
import type {
  SidebarItemDoc,
  SidebarItem,
  SidebarItemCategory,
  SidebarItemCategoryLink,
  PropVersionDocs,
} from './sidebars/types';
import type {
  PropSidebars,
  PropVersionMetadata,
  PropSidebarItem,
  PropSidebarItemCategory,
  PropTagDocList,
  PropTagDocListDoc,
  PropSidebarItemLink,
} from '@docusaurus/plugin-content-docs';
import {compact, keyBy, mapValues} from 'lodash';
import {createDocsByIdIndex} from './docs';

export function toSidebarsProp(loadedVersion: LoadedVersion): PropSidebars {
  const docsById = createDocsByIdIndex(loadedVersion.docs);

  function getDocById(docId: string): DocMetadata {
    const docMetadata = docsById[docId];
    if (!docMetadata) {
      throw new Error(
        `Invalid sidebars file. The document with id "${docId}" was used in the sidebar, but no document with this id could be found.
Available document ids are:
- ${Object.keys(docsById).sort().join('\n- ')}`,
      );
    }
    return docMetadata;
  }

  const convertDocLink = (item: SidebarItemDoc): PropSidebarItemLink => {
    const docMetadata = getDocById(item.id);
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
      docId: docMetadata.unversionedId,
    };
  };

  function getCategoryLinkHref(
    link: SidebarItemCategoryLink | undefined,
  ): string | undefined {
    switch (link?.type) {
      case 'doc':
        return getDocById(link.id).permalink;
      case 'generated-index':
        return link.permalink;
      default:
        return undefined;
    }
  }

  function convertCategory(item: SidebarItemCategory): PropSidebarItemCategory {
    const {link, ...rest} = item;
    const href = getCategoryLinkHref(link);
    return {...rest, items: item.items.map(normalizeItem), ...(href && {href})};
  }

  function normalizeItem(item: SidebarItem): PropSidebarItem {
    switch (item.type) {
      case 'category':
        return convertCategory(item);
      case 'ref':
      case 'doc':
        return convertDocLink(item);
      case 'link':
      default:
        return item;
    }
  }

  // Transform the sidebar so that all sidebar item will be in the
  // form of 'link' or 'category' only.
  // This is what will be passed as props to the UI component.
  return mapValues(loadedVersion.sidebars, (items) => items.map(normalizeItem));
}

function toVersionDocsProp(loadedVersion: LoadedVersion): PropVersionDocs {
  return mapValues(
    keyBy(loadedVersion.docs, (doc) => doc.unversionedId),
    (doc) => ({
      id: doc.unversionedId,
      title: doc.title,
      description: doc.description,
      sidebar: doc.sidebar,
    }),
  );
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
    docs: toVersionDocsProp(loadedVersion),
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
