/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import _ from 'lodash';
import {mergeTranslations} from '@docusaurus/utils';
import {CURRENT_VERSION_NAME} from './constants';
import {
  collectSidebarCategories,
  transformSidebarItems,
  collectSidebarLinks,
  collectSidebarDocItems,
  collectSidebarRefs,
} from './sidebars/utils';
import type {
  LoadedVersion,
  LoadedContent,
} from '@docusaurus/plugin-content-docs';
import type {
  Sidebar,
  SidebarItemCategory,
  SidebarItemCategoryLink,
  Sidebars,
} from './sidebars/types';
import type {
  TranslationFileContent,
  TranslationFile,
  TranslationMessage,
} from '@docusaurus/types';

function getVersionFileName(versionName: string): string {
  if (versionName === CURRENT_VERSION_NAME) {
    return versionName;
  }
  // I don't like this "version-" prefix,
  // but it's for consistency with site/versioned_docs
  return `version-${versionName}`;
}

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
  if (versionName === CURRENT_VERSION_NAME || !sidebarName.includes('/')) {
    return sidebarName;
  }
  const [, ...rest] = sidebarName.split('/');
  return rest.join('/');
}

function getSidebarTranslationFileContent(
  sidebar: Sidebar,
  sidebarName: string,
): TranslationFileContent {
  type TranslationMessageEntry = [string, TranslationMessage];

  const categories = collectSidebarCategories(sidebar);

  const categoryContent: TranslationFileContent = Object.fromEntries(
    categories.flatMap((category) => {
      const entries: TranslationMessageEntry[] = [];

      entries.push([
        `sidebar.${sidebarName}.category.${category.label}`,
        {
          message: category.label,
          description: `The label for category ${category.label} in sidebar ${sidebarName}`,
        },
      ]);

      if (category.link?.type === 'generated-index') {
        if (category.link.title) {
          entries.push([
            `sidebar.${sidebarName}.category.${category.label}.link.generated-index.title`,
            {
              message: category.link.title,
              description: `The generated-index page title for category ${category.label} in sidebar ${sidebarName}`,
            },
          ]);
        }
        if (category.link.description) {
          entries.push([
            `sidebar.${sidebarName}.category.${category.label}.link.generated-index.description`,
            {
              message: category.link.description,
              description: `The generated-index page description for category ${category.label} in sidebar ${sidebarName}`,
            },
          ]);
        }
      }

      return entries;
    }),
  );

  const links = collectSidebarLinks(sidebar);
  const linksContent: TranslationFileContent = Object.fromEntries(
    links.map((link) => [
      `sidebar.${sidebarName}.link.${link.label}`,
      {
        message: link.label,
        description: `The label for link ${link.label} in sidebar ${sidebarName}, linking to ${link.href}`,
      },
    ]),
  );

  const docs = collectSidebarDocItems(sidebar)
    .concat(collectSidebarRefs(sidebar))
    .filter((item) => item.translatable);
  const docLinksContent: TranslationFileContent = Object.fromEntries(
    docs.map((doc) => [
      `sidebar.${sidebarName}.doc.${doc.label!}`,
      {
        message: doc.label!,
        description: `The label for the doc item ${doc.label!} in sidebar ${sidebarName}, linking to the doc ${
          doc.id
        }`,
      },
    ]),
  );

  return mergeTranslations([categoryContent, linksContent, docLinksContent]);
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
  function transformSidebarCategoryLink(
    category: SidebarItemCategory,
  ): SidebarItemCategoryLink | undefined {
    if (!category.link) {
      return undefined;
    }
    if (category.link.type === 'generated-index') {
      const title =
        sidebarsTranslations[
          `sidebar.${sidebarName}.category.${category.label}.link.generated-index.title`
        ]?.message ?? category.link.title;
      const description =
        sidebarsTranslations[
          `sidebar.${sidebarName}.category.${category.label}.link.generated-index.description`
        ]?.message ?? category.link.description;
      return {
        ...category.link,
        title,
        description,
      };
    }
    return category.link;
  }

  return transformSidebarItems(sidebar, (item) => {
    if (item.type === 'category') {
      const link = transformSidebarCategoryLink(item);
      return {
        ...item,
        label:
          sidebarsTranslations[`sidebar.${sidebarName}.category.${item.label}`]
            ?.message ?? item.label,
        ...(link && {link}),
      };
    }
    if (item.type === 'link') {
      return {
        ...item,
        label:
          sidebarsTranslations[`sidebar.${sidebarName}.link.${item.label}`]
            ?.message ?? item.label,
      };
    }
    if ((item.type === 'doc' || item.type === 'ref') && item.translatable) {
      return {
        ...item,
        label:
          sidebarsTranslations[`sidebar.${sidebarName}.doc.${item.label!}`]
            ?.message ?? item.label,
      };
    }
    return item;
  });
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
  return _.mapValues(version.sidebars, (sidebar, sidebarName) =>
    translateSidebar({
      sidebar,
      sidebarName: getNormalizedSidebarName({
        sidebarName,
        versionName: version.versionName,
      }),
      sidebarsTranslations,
    }),
  );
}

function getVersionTranslationFiles(version: LoadedVersion): TranslationFile[] {
  const versionTranslations: TranslationFileContent = {
    'version.label': {
      message: version.label,
      description: `The label for version ${version.versionName}`,
    },
  };

  const sidebarsTranslations: TranslationFileContent =
    getSidebarsTranslations(version);

  return [
    {
      path: getVersionFileName(version.versionName),
      content: mergeTranslations([versionTranslations, sidebarsTranslations]),
    },
  ];
}
function translateVersion(
  version: LoadedVersion,
  translationFiles: {[fileName: string]: TranslationFile},
): LoadedVersion {
  const versionTranslations =
    translationFiles[getVersionFileName(version.versionName)]!.content;
  return {
    ...version,
    label: versionTranslations['version.label']?.message ?? version.label,
    sidebars: translateSidebars(version, versionTranslations),
  };
}

function getVersionsTranslationFiles(
  versions: LoadedVersion[],
): TranslationFile[] {
  return versions.flatMap(getVersionTranslationFiles);
}
function translateVersions(
  versions: LoadedVersion[],
  translationFiles: {[fileName: string]: TranslationFile},
): LoadedVersion[] {
  return versions.map((version) => translateVersion(version, translationFiles));
}

export function getLoadedContentTranslationFiles(
  loadedContent: LoadedContent,
): TranslationFile[] {
  return getVersionsTranslationFiles(loadedContent.loadedVersions);
}
export function translateLoadedContent(
  loadedContent: LoadedContent,
  translationFiles: TranslationFile[],
): LoadedContent {
  const translationFilesMap: {[fileName: string]: TranslationFile} = _.keyBy(
    translationFiles,
    (f) => f.path,
  );

  return {
    loadedVersions: translateVersions(
      loadedContent.loadedVersions,
      translationFilesMap,
    ),
  };
}
