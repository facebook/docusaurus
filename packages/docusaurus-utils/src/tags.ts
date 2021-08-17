/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {kebabCase} from 'lodash';
import {normalizeUrl} from './normalizeUrl';

export type Tag = {
  label: string;
  permalink: string;
};

export type FrontMatterTag = string | Tag;

export function normalizeFrontMatterTag(
  tagsPath: string,
  tag: FrontMatterTag,
): Tag {
  if (typeof tag === 'string') {
    const normalizedTag = kebabCase(tag);
    const permalink = normalizeUrl([tagsPath, normalizedTag]);
    return {
      label: tag,
      permalink,
    };
  }
  return tag;
}

export function normalizeFrontMatterTags(
  tagsPath: string,
  frontMatterTags: FrontMatterTag[] | undefined,
): Tag[] {
  return (
    frontMatterTags?.map((tag) => normalizeFrontMatterTag(tagsPath, tag)) ?? []
  );
}
