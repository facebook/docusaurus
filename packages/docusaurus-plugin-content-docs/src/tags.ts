/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {groupTaggedItems} from '@docusaurus/utils';
import {VersionTags, DocMetadata} from './types';
import {mapValues} from 'lodash';

export function getVersionTags(docs: DocMetadata[]): VersionTags {
  const groups = groupTaggedItems(docs, (doc) => doc.tags);
  return mapValues(groups, (group) => {
    return {
      name: group.tag.label,
      docIds: group.items.map((item) => item.id),
      permalink: group.tag.permalink,
    };
  });
}
