/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  LoadedVersion,
  Sidebar,
  LoadedContent,
  Sidebars,
  SidebarItem,
} from './types';
import path from 'path';

import {chain, mapValues} from 'lodash';
import {collectSidebarCategories, transformSidebarItems} from './sidebars';
import {
  TranslationFileContent,
  TranslationFile,
  TranslationFiles,
} from '@docusaurus/types';

/*
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

 */

export function translateVersion(
  version: LoadedVersion,
  translationFiles: Record<string, TranslationFile>,
): LoadedVersion {
  // TODO complete this
  return {
    ...version,
    sidebars: translateSidebars(version, translationFiles),
  };
}

export function translateAllVersions(
  versions: LoadedVersion[],
  translationFiles: Record<string, TranslationFile>,
): LoadedVersion[] {
  return versions.map((version) => {
    return translateVersion(version, translationFiles);
  });
}

export function translateLoadedContent(
  loadedContent: LoadedContent,
  translationFiles: Record<string, TranslationFile>,
): LoadedContent {
  return {
    ...loadedContent,
    loadedVersions: translateAllVersions(
      loadedContent.loadedVersions,
      translationFiles,
    ),
  };
}

export function getSidebarTranslationFileContent(
  sidebar: Sidebar,
): TranslationFileContent {
  const categories = collectSidebarCategories(sidebar);
  return chain(categories)
    .keyBy((category) => category.label)
    .mapValues((category) => ({
      message: category.label,
    }))
    .value();
}

export function translateSidebar(
  sidebar: Sidebar,
  sidebarTranslations: TranslationFileContent,
  // docsTranslations: TranslationFileContent,
): Sidebar {
  return transformSidebarItems(
    sidebar,
    (item: SidebarItem): SidebarItem => {
      if (item.type === 'category') {
        return {
          ...item,
          label: sidebarTranslations[item.label]?.message ?? item.label,
        };
      }
      if (item.type === 'doc') {
        // TODO translate sidebarLabel !
        /*
      return {
        ...item,
        label:
          docsTranslations[item.id]?.sidebarLabel ??
          docsTranslations[item.id]?.title ??
          'todo !!!',
      };

       */
      }
      return item;
    },
  );
}

export function getSidebarTranslationFilePath({
  sidebarName,
  versionName,
}: {
  sidebarName: string;
  versionName: string;
}) {
  // TODO legacy, the sidebar name is like "version-2.0.0-alpha.66/docs"
  function getNormalizedSidebarName(): string {
    if (versionName === 'current') {
      return sidebarName;
    }
    const [, ...rest] = sidebarName.split('/');
    return rest.join('/');
  }

  return path.join(versionName, `sidebar-${getNormalizedSidebarName()}.json`);
}

export function getSidebarsTranslationFiles(
  version: LoadedVersion,
): TranslationFile[] {
  return Object.entries(version.sidebars).map(([sidebarName, sidebar]) => {
    return {
      path: getSidebarTranslationFilePath({
        sidebarName,
        versionName: version.versionName,
      }),
      content: getSidebarTranslationFileContent(sidebar),
    };
  });
}

export function translateSidebars(
  version: LoadedVersion,
  translationFiles: Record<string, TranslationFile>,
): Sidebars {
  return mapValues(version.sidebars, (sidebar, sidebarName) => {
    const translationFilePath = getSidebarTranslationFilePath({
      versionName: version.versionName,
      sidebarName,
    });
    const translationFile = translationFiles[translationFilePath];
    return translateSidebar(sidebar, translationFile.content);
  });
}

export async function getVersionTranslationFiles(
  version: LoadedVersion,
): Promise<TranslationFiles> {
  return [...getSidebarsTranslationFiles(version)];
}
