/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/// <reference types="@docusaurus/module-type-aliases" />

import type {Sidebars} from './sidebars/types';
import type {BrokenMarkdownLink, Tag} from '@docusaurus/utils';
import type {
  VersionMetadata,
  LastUpdateData,
  DocMetadata,
  CategoryGeneratedIndexMetadata,
} from '@docusaurus/plugin-content-docs';

export type DocFile = {
  contentPath: string; // /!\ may be localized
  filePath: string; // /!\ may be localized
  source: string;
  content: string;
  lastUpdate: LastUpdateData;
};

export type SourceToPermalink = {
  [source: string]: string;
};

export type VersionTag = Tag & {
  /** all doc ids having this tag. */
  docIds: string[];
};
export type VersionTags = {
  [key: string]: VersionTag;
};

export type LoadedVersion = VersionMetadata & {
  mainDocId: string;
  docs: DocMetadata[];
  sidebars: Sidebars;
  categoryGeneratedIndices: CategoryGeneratedIndexMetadata[];
};

export type LoadedContent = {
  loadedVersions: LoadedVersion[];
};

export type DocBrokenMarkdownLink = BrokenMarkdownLink<VersionMetadata>;

export type DocsMarkdownOption = {
  versionsMetadata: VersionMetadata[];
  siteDir: string;
  sourceToPermalink: SourceToPermalink;
  onBrokenMarkdownLink: (brokenMarkdownLink: DocBrokenMarkdownLink) => void;
};
