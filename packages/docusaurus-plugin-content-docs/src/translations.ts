/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import _ from 'lodash';
import {mergeTranslations} from '@docusaurus/utils';
import logger from '@docusaurus/logger';
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

type TranslationMessageEntry = [string, TranslationMessage];

function ensureNoSidebarDuplicateEntries(
  translationEntries: TranslationMessageEntry[],
): void {
  const grouped = _.groupBy(translationEntries, (entry) => entry[0]);
  const duplicates = Object.entries(grouped).filter(
    (entry) => entry[1].length > 1,
  );

  if (duplicates.length > 0) {
    throw new Error(`Multiple docs sidebar items produce the same translation key.
- ${duplicates
      .map(([translationKey, entries]) => {
        return `${logger.code(translationKey)}: ${logger.num(
          entries.length,
        )} duplicates found:\n  - ${entries
          .map((duplicate) => {
            const desc = duplicate[1].description;
            return `${logger.name(duplicate[1].message)} ${
              desc ? `(${logger.subdue(desc)})` : ''
            }`;
          })
          .join('\n  - ')}`;
      })
      .join('\n\n- ')}

To avoid translation key conflicts, use the ${logger.code(
      'key',
    )} attribute on the sidebar items above to uniquely identify them.
    `);
  }
}

function getSidebarTranslationFileContent(
  sidebar: Sidebar,
  sidebarName: string,
): TranslationFileContent {
  const categories = collectSidebarCategories(sidebar);

  const categoryEntries: TranslationMessageEntry[] = categories.flatMap(
    (category) => {
      const entries: TranslationMessageEntry[] = [];
      const categoryKey = category.key ?? category.label;

      entries.push([
        `sidebar.${sidebarName}.category.${categoryKey}`,
        {
          message: category.label,
          description: `The label for category ${category.label} in sidebar ${sidebarName}`,
        },
      ]);

      if (category.link?.type === 'generated-index') {
        if (category.link.title) {
          entries.push([
            `sidebar.${sidebarName}.category.${categoryKey}.link.generated-index.title`,
            {
              message: category.link.title,
              description: `The generated-index page title for category ${category.label} in sidebar ${sidebarName}`,
            },
          ]);
        }
        if (category.link.description) {
          entries.push([
            `sidebar.${sidebarName}.category.${categoryKey}.link.generated-index.description`,
            {
              message: category.link.description,
              description: `The generated-index page description for category ${category.label} in sidebar ${sidebarName}`,
            },
          ]);
        }
      }

      return entries;
    },
  );

  const links = collectSidebarLinks(sidebar);
  const linksEntries: TranslationMessageEntry[] = links.map((link) => {
    const linkKey = link.key ?? link.label;
    return [
      `sidebar.${sidebarName}.link.${linkKey}`,
      {
        message: link.label,
        description: `The label for link ${link.label} in sidebar ${sidebarName}, linking to ${link.href}`,
      },
    ];
  });

  const docs = collectSidebarDocItems(sidebar)
    .concat(collectSidebarRefs(sidebar))
    .filter((item) => item.translatable);
  const docLinksEntries: TranslationMessageEntry[] = docs.map((doc) => {
    const docKey = doc.key ?? doc.label!;
    return [
      `sidebar.${sidebarName}.doc.${docKey}`,
      {
        message: doc.label!,
        description: `The label for the doc item ${doc.label!} in sidebar ${sidebarName}, linking to the doc ${
          doc.id
        }`,
      },
    ];
  });

  const allEntries = [...categoryEntries, ...linksEntries, ...docLinksEntries];
  ensureNoSidebarDuplicateEntries(allEntries);
  return Object.fromEntries(allEntries);
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
      const categoryKey = item.key ?? item.label;
      return {
        ...item,
        label:
          sidebarsTranslations[`sidebar.${sidebarName}.category.${categoryKey}`]
            ?.message ?? item.label,
        ...(link && {link}),
      };
    }
    if (item.type === 'link') {
      const linkKey = item.key ?? item.label;
      return {
        ...item,
        label:
          sidebarsTranslations[`sidebar.${sidebarName}.link.${linkKey}`]
            ?.message ?? item.label,
      };
    }
    if ((item.type === 'doc' || item.type === 'ref') && item.translatable) {
      const docKey = item.key ?? item.label!;
      return {
        ...item,
        label:
          sidebarsTranslations[`sidebar.${sidebarName}.doc.${docKey}`]
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
    Object.entries(version.sidebars).map(([sidebarName, sidebar]) =>
      getSidebarTranslationFileContent(sidebar, sidebarName),
    ),
  );
}
function translateSidebars(
  version: LoadedVersion,
  sidebarsTranslations: TranslationFileContent,
): Sidebars {
  return _.mapValues(version.sidebars, (sidebar, sidebarName) =>
    translateSidebar({
      sidebar,
      sidebarName,
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
