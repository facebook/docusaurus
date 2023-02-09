/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import _ from 'lodash';
import {groupTaggedItems} from '@docusaurus/utils';
import type {VersionTags} from './types';
import type {DocMetadata} from '@docusaurus/plugin-content-docs';

export function getVersionTags(docs: DocMetadata[]): VersionTags {
  const groups = groupTaggedItems(docs, (doc) => doc.tags);
  return _.mapValues(groups, (group) => ({
    label: group.tag.label,
    docIds: group.items.map((item) => item.id),
    permalink: group.tag.permalink,
  }));
}
