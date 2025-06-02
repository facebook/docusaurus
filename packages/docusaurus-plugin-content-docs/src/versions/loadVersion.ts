/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import _ from 'lodash';
import {createSlugger} from '@docusaurus/utils';
import {getTagsFile} from '@docusaurus/utils-validation';
import logger from '@docusaurus/logger';
import {
  addDocNavigation,
  createDocsByIdIndex,
  type DocEnv,
  processDocMetadata,
  readVersionDocs,
} from '../docs';
import {loadSidebars} from '../sidebars';
import {createSidebarsUtils} from '../sidebars/utils';
import type {TagsFile} from '@docusaurus/utils';
import type {
  DocMetadataBase,
  LoadedVersion,
  PluginOptions,
  VersionMetadata,
} from '@docusaurus/plugin-content-docs';
import type {DocFile} from '../types';
import type {LoadContext} from '@docusaurus/types';

export async function loadVersion({
  context,
  options,
  versionMetadata,
  env,
}: {
  context: LoadContext;
  options: PluginOptions;
  versionMetadata: VersionMetadata;
  env: DocEnv;
}): Promise<LoadedVersion> {
  const {siteDir} = context;

  async function loadVersionDocsBase(
    tagsFile: TagsFile | null,
  ): Promise<DocMetadataBase[]> {
    const docFiles = await readVersionDocs(versionMetadata, options);
    if (docFiles.length === 0) {
      throw new Error(
        `Docs version "${
          versionMetadata.versionName
        }" has no docs! At least one doc should exist at "${path.relative(
          siteDir,
          versionMetadata.contentPath,
        )}".`,
      );
    }
    function processVersionDoc(docFile: DocFile) {
      return processDocMetadata({
        docFile,
        versionMetadata,
        context,
        options,
        env,
        tagsFile,
      });
    }
    return Promise.all(docFiles.map(processVersionDoc));
  }

  async function doLoadVersion(): Promise<LoadedVersion> {
    const tagsFile = await getTagsFile({
      contentPaths: versionMetadata,
      tags: options.tags,
    });

    const docsBase: DocMetadataBase[] = await loadVersionDocsBase(tagsFile);

    // TODO we only ever need draftIds in further code, not full draft items
    // To simplify and prevent mistakes, avoid exposing draft
    // replace draft=>draftIds in content loaded
    const [drafts, docs] = _.partition(docsBase, (doc) => doc.draft);

    const sidebars = await loadSidebars(versionMetadata.sidebarFilePath, {
      sidebarItemsGenerator: options.sidebarItemsGenerator,
      numberPrefixParser: options.numberPrefixParser,
      docs,
      drafts,
      version: versionMetadata,
      sidebarOptions: {
        sidebarCollapsed: options.sidebarCollapsed,
        sidebarCollapsible: options.sidebarCollapsible,
      },
      categoryLabelSlugger: createSlugger(),
    });

    const sidebarsUtils = createSidebarsUtils(sidebars);

    const docsById = createDocsByIdIndex(docs);
    const allDocIds = Object.keys(docsById);

    sidebarsUtils.checkLegacyVersionedSidebarNames({
      sidebarFilePath: versionMetadata.sidebarFilePath as string,
      versionMetadata,
    });
    sidebarsUtils.checkSidebarsDocIds({
      allDocIds,
      sidebarFilePath: versionMetadata.sidebarFilePath as string,
      versionMetadata,
    });

    return {
      ...versionMetadata,
      docs: addDocNavigation({
        docs,
        sidebarsUtils,
      }),
      drafts,
      sidebars,
    };
  }

  try {
    return await doLoadVersion();
  } catch (err) {
    logger.error`Loading of version failed for version name=${versionMetadata.versionName}`;
    throw err;
  }
}
