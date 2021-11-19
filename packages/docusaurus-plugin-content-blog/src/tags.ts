/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable @typescript-eslint/no-unused-vars */

import {Tag} from '@docusaurus/utils';
import {BlogPostFrontMatter} from './blogFrontMatter';
import {BlogContentPaths} from './types';

type TagsParam = {
  frontMatter: BlogPostFrontMatter;
  tagList: Tag[] | undefined;
};

type TagsFileParams = {
  tagsFilePath: string;
  contentPaths: BlogContentPaths;
};

export function getBlogPostTags(params: TagsParam): Tag[] {
  throw new Error('Not yet implemented');
}

export async function getTagsList(
  params: TagsFileParams,
): Promise<Tag[] | undefined> {
  throw new Error('Not yet implemented');
}

export async function getTagsListFilePath({
  tagsFilePath,
  contentPaths,
}: TagsFileParams): Promise<string | undefined> {
  throw new Error('Not yet implemented');
}

export function validateTagsListFile(content: unknown): Tag[] {
  throw new Error('Not yet implemented');
}

export async function readTagsListFile(
  filePath: string,
): Promise<Tag[] | undefined> {
  throw new Error('Not yet implemented');
}
