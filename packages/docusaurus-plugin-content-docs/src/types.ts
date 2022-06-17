/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {BrokenMarkdownLink, Tag} from '@docusaurus/utils';
import type {
  VersionMetadata,
  LoadedVersion,
  CategoryGeneratedIndexMetadata,
} from '@docusaurus/plugin-content-docs';
import type {SidebarsUtils} from './sidebars/utils';

export type DocFile = {
  contentPath: string; // /!\ may be localized
  filePath: string; // /!\ may be localized
  source: string;
  content: string;
};

export type SourceToPermalink = {
  [source: string]: string;
};

export type VersionTag = Tag & {
  /** All doc ids having this tag. */
  docIds: string[];
};
export type VersionTags = {
  [permalink: string]: VersionTag;
};

export type FullVersion = LoadedVersion & {
  sidebarsUtils: SidebarsUtils;
  categoryGeneratedIndices: CategoryGeneratedIndexMetadata[];
};

export type DocBrokenMarkdownLink = BrokenMarkdownLink<VersionMetadata>;

export type DocsMarkdownOption = {
  versionsMetadata: VersionMetadata[];
  siteDir: string;
  sourceToPermalink: SourceToPermalink;
  onBrokenMarkdownLink: (brokenMarkdownLink: DocBrokenMarkdownLink) => void;
};
