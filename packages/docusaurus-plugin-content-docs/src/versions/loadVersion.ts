/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import _ from 'lodash';
import {aliasedSitePathToRelativePath, createSlugger} from '@docusaurus/utils';
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

type LoadVersionParams = {
  context: LoadContext;
  options: PluginOptions;
  versionMetadata: VersionMetadata;
  env: DocEnv;
};

function ensureNoDuplicateDocId(docs: DocMetadataBase[]): void {
  const duplicatesById = _.chain(docs)
    .groupBy((d) => d.id)
    .pickBy((group) => group.length > 1)
    .value();

  const duplicateIdEntries = Object.entries(duplicatesById);

  if (duplicateIdEntries.length) {
    const idMessages = duplicateIdEntries
      .map(([id, duplicateDocs]) => {
        return logger.interpolate`- code=${id} found in number=${
          duplicateDocs.length
        } docs:
  - ${duplicateDocs
    .map((d) => aliasedSitePathToRelativePath(d.source))
    .join('\n  - ')}`;
      })
      .join('\n\n');

    const message = `The docs plugin found docs sharing the same id:
\n${idMessages}\n
Docs should have distinct ids.
In case of conflict, you can rename the docs file, or use the ${logger.code(
      'id',
    )} front matter to assign an explicit distinct id to each doc.
    `;

    throw new Error(message);
  }
}

async function loadVersionDocsBase({
  tagsFile,
  context,
  options,
  versionMetadata,
  env,
}: LoadVersionParams & {
  tagsFile: TagsFile | null;
}): Promise<DocMetadataBase[]> {
  const docFiles = await readVersionDocs(versionMetadata, options);
  if (docFiles.length === 0) {
    throw new Error(
      `Docs version "${
        versionMetadata.versionName
      }" has no docs! At least one doc should exist at "${path.relative(
        context.siteDir,
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
  const docs = await Promise.all(docFiles.map(processVersionDoc));
  ensureNoDuplicateDocId(docs);
  return docs;
}

async function doLoadVersion({
  context,
  options,
  versionMetadata,
  env,
}: LoadVersionParams): Promise<LoadedVersion> {
  const tagsFile = await getTagsFile({
    contentPaths: versionMetadata,
    tags: options.tags,
  });

  const docsBase: DocMetadataBase[] = await loadVersionDocsBase({
    tagsFile,
    context,
    options,
    versionMetadata,
    env,
  });

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

export async function loadVersion(
  params: LoadVersionParams,
): Promise<LoadedVersion> {
  try {
    return await doLoadVersion(params);
  } catch (err) {
    // TODO use error cause (but need to refactor many tests)
    logger.error`Loading of version failed for version name=${params.versionMetadata.versionName}`;
    throw err;
  }
}
