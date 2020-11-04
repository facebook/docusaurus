/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  LoadedVersion,
  Sidebar,
  DocMetadata,
  VersionTranslations,
  DocTranslations,
  SidebarTranslations,
  LoadedContent,
  LoadedContentTranslations,
} from './types';

import {chain, mapValues} from 'lodash';
import {collectSidebarCategories, transformSidebarItems} from './sidebars';

export function getSidebarTranslation(sidebar: Sidebar): SidebarTranslations {
  const categories = collectSidebarCategories(sidebar);
  const categoriesTranslations = chain(categories)
    .keyBy((category) => category.label)
    .mapValues((category) => category.label)
    .value();
  return {categories: categoriesTranslations};
}

export function translateSidebar(
  sidebar: Sidebar,
  sidebarTranslations: SidebarTranslations | undefined,
  docsTranslations: Record<string, DocTranslations | undefined> | undefined,
): Sidebar {
  return transformSidebarItems(sidebar, (item) => {
    if (item.type === 'category') {
      return {
        ...item,
        label: sidebarTranslations?.categories?.[item.label] ?? item.label,
      };
    }
    if (item.type === 'doc') {
      return {
        ...item,
        label:
          docsTranslations?.[item.id]?.sidebarLabel ??
          docsTranslations?.[item.id]?.title ??
          'todo !!!',
      };
    }
    return item;
  });
}

export function getDocTranslations(doc: DocMetadata): DocTranslations {
  return {
    title: doc.title,
    ...(doc.sidebar_label ? {sidebarLabel: doc.sidebar_label} : undefined),
  };
}
export function translateDoc(
  doc: DocMetadata,
  docTranslations: DocTranslations | undefined,
): DocMetadata {
  return {
    ...doc,
    title: docTranslations?.title ?? doc.title,
  };
}
export function translateDocs(
  docs: DocMetadata[],
  docsTranslations: Record<string, DocTranslations | undefined> | undefined,
): DocMetadata[] {
  return docs.map((doc) => {
    const docTranslations = docsTranslations?.[doc.id];
    return translateDoc(doc, docTranslations);
  });
}

export function getVersionTranslations(
  version: LoadedVersion,
): VersionTranslations {
  const sidebars = mapValues(version.sidebars, getSidebarTranslation);
  const docs = chain(version.docs)
    .keyBy((doc) => doc.id)
    .mapValues(getDocTranslations)
    .value();
  return {
    label: version.versionLabel,
    sidebars,
    docs,
  };
}
export function translateVersion(
  version: LoadedVersion,
  versionTranslations: VersionTranslations | undefined,
): LoadedVersion {
  const versionLabel = versionTranslations?.label ?? version.versionLabel;

  const docsTranslations = versionTranslations?.docs;

  const sidebarsTranslated = mapValues(
    version.sidebars,
    (sidebar, sidebarName) => {
      const sidebarTranslations = versionTranslations?.sidebars?.[sidebarName];
      return translateSidebar(sidebar, sidebarTranslations, docsTranslations);
    },
  );

  const docsTranslated = translateDocs(version.docs, docsTranslations);

  return {
    ...version,
    versionLabel,
    sidebars: sidebarsTranslated,
    docs: docsTranslated,
  };
}

export function getAllVersionsTranslations(
  versions: LoadedVersion[],
): Record<string, VersionTranslations> {
  return chain(versions)
    .keyBy((version) => version.versionName)
    .mapValues(getVersionTranslations)
    .value();
}

export function translateAllVersions(
  versions: LoadedVersion[],
  versionsTranslations?: Record<string, VersionTranslations>,
): LoadedVersion[] {
  return versions.map((version) => {
    const versionTranslations = versionsTranslations?.[version.versionName];
    return translateVersion(version, versionTranslations);
  });
}

export function getLoadedContentTranslations(
  loadedContent: LoadedContent,
): LoadedContentTranslations {
  return {
    versions: getAllVersionsTranslations(loadedContent.loadedVersions),
  };
}
export function translateLoadedContent(
  loadedContent: LoadedContent,
  loadedContentTranslations: LoadedContentTranslations | undefined,
): LoadedContent {
  return {
    ...loadedContent,
    loadedVersions: translateAllVersions(
      loadedContent.loadedVersions,
      loadedContentTranslations?.versions,
    ),
  };
}
