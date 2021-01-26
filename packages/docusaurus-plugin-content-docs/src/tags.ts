/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {normalizeUrl} from '@docusaurus/utils';
import {VersionTags, DocMetadata} from './types';
import {kebabCase} from 'lodash';

function normalizeTag(tag: string): string {
  return kebabCase(tag);
}

export function getVersionTags({
  tagsPath,
  docs,
}: {
  tagsPath: string;
  docs: DocMetadata[];
}): VersionTags {
  const versionTags: VersionTags = {};

  function initTagData(tag: string) {
    return {
      // Will only use the name of the first occurrence of the tag
      name: tag.toLowerCase(),
      permalink: normalizeUrl([tagsPath, normalizeTag(tag)]),
      docIds: [],
    };
  }

  docs.forEach((doc) => {
    const tags: readonly string[] = doc.tags ?? [];
    tags.forEach((tag) => {
      const normalizedTag = normalizeTag(tag);
      // init data for a tag the first time we see it
      if (!versionTags[normalizedTag]) {
        versionTags[normalizedTag] = initTagData(tag);
      }
      versionTags[normalizedTag].docIds.push(doc.id);
    });
  });

  return versionTags;
}
