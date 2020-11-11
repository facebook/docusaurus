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
  DocMetadata,
} from './types';
import path from 'path';

import {chain, mapValues, flatten} from 'lodash';
import {
  collectSidebarCategories,
  transformSidebarItems,
  collectSidebarLinks,
} from './sidebars';
import {
  TranslationFileContent,
  TranslationFile,
  TranslationFiles,
} from '@docusaurus/types';
import {mergeTranslations} from '@docusaurus/utils';

// TODO legacy, the sidebar name is like "version-2.0.0-alpha.66/docs"
// input: "version-2.0.0-alpha.66/docs"
// output: "docs"
function getNormalizedSidebarName({
  versionName,
  sidebarName,
}: {
  versionName: string;
  sidebarName: string;
}): string {
  if (versionName === 'current') {
    return sidebarName;
  }
  const [, ...rest] = sidebarName.split('/');
  return rest.join('/');
}

function getDocTranslations(doc: DocMetadata): TranslationFileContent {
  return {
    [`${doc.unversionedId}.title`]: {
      message: doc.title,
      description: `The title for doc with id=${doc.unversionedId}`,
    },
    ...(doc.sidebar_label
      ? {
          [`${doc.unversionedId}.sidebar_label`]: {
            message: doc.sidebar_label,
            description: `The sidebar label for doc with id=${doc.unversionedId}`,
          },
        }
      : undefined),
  };
}
function translateDoc(
  doc: DocMetadata,
  docsTranslations: TranslationFileContent,
): DocMetadata {
  return {
    ...doc,
    title: docsTranslations[`${doc.unversionedId}.title`]?.message ?? doc.title,
    sidebar_label:
      docsTranslations[`${doc.unversionedId}.sidebar_label`]?.message ??
      doc.sidebar_label,
  };
}

function getDocsTranslations(version: LoadedVersion): TranslationFileContent {
  return mergeTranslations(version.docs.map(getDocTranslations));
}
function translateDocs(
  docs: DocMetadata[],
  docsTranslations: TranslationFileContent,
): DocMetadata[] {
  return docs.map((doc) => translateDoc(doc, docsTranslations));
}

function getSidebarTranslationFileContent(
  sidebar: Sidebar,
  sidebarName: string,
): TranslationFileContent {
  const categories = collectSidebarCategories(sidebar);
  const categoryContent: TranslationFileContent = chain(categories)
    .keyBy((category) => `${sidebarName}.category.${category.label}`)
    .mapValues((category) => ({
      message: category.label,
      description: `The label for category ${category.label} in sidebar ${sidebarName}`,
    }))
    .value();

  const links = collectSidebarLinks(sidebar);
  const linksContent: TranslationFileContent = chain(links)
    .keyBy((link) => `${sidebarName}.link.${link.label}`)
    .mapValues((link) => ({
      message: link.label,
      description: `The label for link ${link.label} in sidebar ${sidebarName}, linking to ${link.href}`,
    }))
    .value();

  return mergeTranslations([categoryContent, linksContent]);
}

function translateSidebar({
  sidebar,
  sidebarName,
  sidebarsTranslations,
}: {
  sidebar: Sidebar;
  sidebarName: string;
  sidebarsTranslations: TranslationFileContent;
}): Sidebar {
  return transformSidebarItems(
    sidebar,
    (item: SidebarItem): SidebarItem => {
      if (item.type === 'category') {
        return {
          ...item,
          label:
            sidebarsTranslations[`${sidebarName}.category.${item.label}`]
              ?.message ?? item.label,
        };
      }
      if (item.type === 'link') {
        return {
          ...item,
          label:
            sidebarsTranslations[`${sidebarName}.link.${item.label}`]
              ?.message ?? item.label,
        };
      }
      return item;
    },
  );
}

function getSidebarsTranslations(
  version: LoadedVersion,
): TranslationFileContent {
  return mergeTranslations(
    Object.entries(version.sidebars).map(([sidebarName, sidebar]) => {
      const normalizedSidebarName = getNormalizedSidebarName({
        sidebarName,
        versionName: version.versionName,
      });
      return getSidebarTranslationFileContent(sidebar, normalizedSidebarName);
    }),
  );
}
function translateSidebars(
  version: LoadedVersion,
  sidebarsTranslations: TranslationFileContent,
): Sidebars {
  return mapValues(version.sidebars, (sidebar, sidebarName) => {
    return translateSidebar({
      sidebar,
      sidebarName: getNormalizedSidebarName({
        sidebarName,
        versionName: version.versionName,
      }),
      sidebarsTranslations,
    });
  });
}

function getVersionTranslationFiles(version: LoadedVersion): TranslationFiles {
  const versionTranslationFile: TranslationFile = {
    path: path.join(version.versionName, 'version'),
    content: {
      label: {
        message: version.versionLabel,
        description: `The label for version ${version.versionName}`,
      },
    },
  };

  const docsTranslationFile = {
    path: path.join(version.versionName, 'docs'),
    content: getDocsTranslations(version),
  };

  const sidebarsTranslationFile = {
    path: path.join(version.versionName, 'sidebars'),
    content: getSidebarsTranslations(version),
  };

  return [versionTranslationFile, docsTranslationFile, sidebarsTranslationFile];
}
function translateVersion(
  version: LoadedVersion,
  translationFiles: Record<string, TranslationFile>,
): LoadedVersion {
  const versionTranslations =
    translationFiles[path.join(version.versionName, 'version')].content;
  const sidebarsTranslations =
    translationFiles[path.join(version.versionName, 'sidebars')].content;
  const docsTranslations =
    translationFiles[path.join(version.versionName, 'docs')].content;

  return {
    ...version,
    versionLabel: versionTranslations.label?.message,
    sidebars: translateSidebars(version, sidebarsTranslations),
    docs: translateDocs(version.docs, docsTranslations),
  };
}

function getVersionsTranslationFiles(
  versions: LoadedVersion[],
): TranslationFiles {
  return flatten(versions.map(getVersionTranslationFiles));
}
function translateVersions(
  versions: LoadedVersion[],
  translationFiles: Record<string, TranslationFile>,
): LoadedVersion[] {
  return versions.map((version) => translateVersion(version, translationFiles));
}

export function getLoadedContentTranslationFiles(
  loadedContent: LoadedContent,
): TranslationFiles {
  return getVersionsTranslationFiles(loadedContent.loadedVersions);
}
export function translateLoadedContent(
  loadedContent: LoadedContent,
  translationFiles: Record<string, TranslationFile>,
): LoadedContent {
  return {
    loadedVersions: translateVersions(
      loadedContent.loadedVersions,
      translationFiles,
    ),
  };
}
