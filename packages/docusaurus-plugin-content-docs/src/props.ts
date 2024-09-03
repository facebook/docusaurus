/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import _ from 'lodash';
import {createDocsByIdIndex} from './docs';
import type {VersionTag, VersionTags} from './types';
import type {
  SidebarItemDoc,
  SidebarItem,
  SidebarItemCategory,
  SidebarItemCategoryLink,
} from './sidebars/types';
import type {
  PropSidebars,
  PropVersionMetadata,
  PropSidebarItem,
  PropSidebarItemCategory,
  PropTagDocList,
  PropTagDocListDoc,
  PropTagsListPage,
  PropSidebarItemLink,
  PropVersionDocs,
  DocMetadata,
  LoadedVersion,
} from '@docusaurus/plugin-content-docs';

export function toSidebarDocItemLinkProp({
  item,
  doc,
}: {
  item: SidebarItemDoc;
  doc: Pick<
    DocMetadata,
    'id' | 'title' | 'permalink' | 'unlisted' | 'frontMatter'
  >;
}): PropSidebarItemLink {
  const {
    id,
    title,
    permalink,
    frontMatter: {
      sidebar_label: sidebarLabel,
      sidebar_custom_props: customProps,
    },
    unlisted,
  } = doc;
  return {
    type: 'link',
    label: sidebarLabel ?? item.label ?? title,
    href: permalink,
    className: item.className,
    customProps: item.customProps ?? customProps,
    docId: id,
    unlisted,
  };
}

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
    const doc = getDocById(item.id);
    return toSidebarDocItemLinkProp({item, doc});
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

  function getCategoryLinkUnlisted(
    link: SidebarItemCategoryLink | undefined,
  ): boolean {
    if (link?.type === 'doc') {
      return getDocById(link.id).unlisted;
    }
    return false;
  }

  function getCategoryLinkCustomProps(
    link: SidebarItemCategoryLink | undefined,
  ) {
    switch (link?.type) {
      case 'doc':
        return getDocById(link.id).frontMatter.sidebar_custom_props;
      default:
        return undefined;
    }
  }

  function convertCategory(item: SidebarItemCategory): PropSidebarItemCategory {
    const {link, ...rest} = item;
    const href = getCategoryLinkHref(link);
    const linkUnlisted = getCategoryLinkUnlisted(link);
    const customProps = item.customProps ?? getCategoryLinkCustomProps(link);

    return {
      ...rest,
      items: item.items.map(normalizeItem),
      ...(href && {href}),
      ...(linkUnlisted && {linkUnlisted}),
      ...(customProps && {customProps}),
    };
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
  return _.mapValues(loadedVersion.sidebars, (items) =>
    items.map(normalizeItem),
  );
}

function toVersionDocsProp(loadedVersion: LoadedVersion): PropVersionDocs {
  return Object.fromEntries(
    loadedVersion.docs.map((doc) => [
      doc.id,
      {
        id: doc.id,
        title: doc.title,
        description: doc.description,
        sidebar: doc.sidebar,
      },
    ]),
  );
}

export function toVersionMetadataProp(
  pluginId: string,
  loadedVersion: LoadedVersion,
): PropVersionMetadata {
  return {
    pluginId,
    version: loadedVersion.versionName,
    label: loadedVersion.label,
    banner: loadedVersion.banner,
    badge: loadedVersion.badge,
    noIndex: loadedVersion.noIndex,
    className: loadedVersion.className,
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
  docs: DocMetadata[];
}): PropTagDocList {
  function toDocListProp(): PropTagDocListDoc[] {
    const list = _.compact(
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
    label: tag.label,
    permalink: tag.permalink,
    description: tag.description,
    allTagsPath,
    count: tag.docIds.length,
    items: toDocListProp(),
    unlisted: tag.unlisted,
  };
}

export function toTagsListTagsProp(
  versionTags: VersionTags,
): PropTagsListPage['tags'] {
  return Object.values(versionTags)
    .filter((tagValue) => !tagValue.unlisted)
    .map((tagValue) => ({
      label: tagValue.label,
      permalink: tagValue.permalink,
      description: tagValue.description,
      count: tagValue.docIds.length,
    }));
}
